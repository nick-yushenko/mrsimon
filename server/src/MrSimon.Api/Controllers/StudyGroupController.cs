using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrSimon.Api.Data;
using MrSimon.Api.Dtos.Common;
using MrSimon.Api.Dtos.StudyGroups;
using MrSimon.Api.Models;

namespace MrSimon.Api.Controllers;

// [Authorize]
[ApiController]
[Route("api/study-groups")]
public class StudyGroupController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudyGroupController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<StudyGroupListItemDto>>> GetStudyGroups(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] bool includeArchived = false
    )
    {
        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1)
        {
            pageSize = 5;
        }

        if (pageSize > 100)
        {
            pageSize = 100;
        }

        var query = _db.StudyGroups.AsNoTracking().AsQueryable();

        if (!includeArchived)
        {
            query = query.Where(group => group.Status != GroupStatus.Archived);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLower();

            query = query.Where(group =>
                group.Name.ToLower().Contains(normalizedSearch)
                || (
                    group.Description != null
                    && group.Description.ToLower().Contains(normalizedSearch)
                )
                || group.Subject.Name.ToLower().Contains(normalizedSearch)
            );
        }

        query = query.OrderByDescending(group => group.CreatedAt);

        var totalCount = await query.CountAsync();

        var groups = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(group => new StudyGroupListItemDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                SubjectId = group.SubjectId,
                SubjectName = group.Subject.Name,
                PricePerLesson = group.PricePerLesson,
                StartsOn = group.StartsOn,
                EndsOn = group.EndsOn,
                Status = group.Status,
                StudentsCount = group.Members.Count(member =>
                    member.Role == GroupMemberRole.Student
                ),
                CreatedAt = group.CreatedAt,
            })
            .ToListAsync();

        return Ok(
            new PagedResult<StudyGroupListItemDto>
            {
                Items = groups,
                Page = page,
                PageSize = pageSize,
                TotalCount = totalCount,
                TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
            }
        );
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<StudyGroupDetailsDto>> GetStudyGroupById(int id)
    {
        var group = await GetStudyGroupDetailsDto(id);

        if (group == null)
        {
            return NotFound();
        }

        return Ok(group);
    }

    [HttpPost]
    public async Task<ActionResult<StudyGroupDetailsDto>> CreateStudyGroup(
        CreateStudyGroupRequest request
    )
    {
        var subjectExists = await _db.Subjects.AnyAsync(subject => subject.Id == request.SubjectId);

        if (!subjectExists)
        {
            ModelState.AddModelError(nameof(request.SubjectId), "Предмет не найден.");
            return ValidationProblem(ModelState);
        }

        var group = new StudyGroup
        {
            Name = request.Name.Trim(),
            Description = NormalizeOptionalText(request.Description),
            SubjectId = request.SubjectId,
            PricePerLesson = request.PricePerLesson,
            StartsOn = request.StartsOn!.Value,
            EndsOn = request.EndsOn!.Value,
            Status = GroupStatus.Active,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        _db.StudyGroups.Add(group);
        await _db.SaveChangesAsync();

        var createdGroup = await GetStudyGroupDetailsDto(group.Id);

        return CreatedAtAction(nameof(GetStudyGroupById), new { id = group.Id }, createdGroup);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateStudyGroup(int id, UpdateStudyGroupRequest request)
    {
        var group = await _db.StudyGroups.FirstOrDefaultAsync(group => group.Id == id);

        if (group == null)
        {
            return NotFound();
        }

        var subjectExists = await _db.Subjects.AnyAsync(subject => subject.Id == request.SubjectId);

        if (!subjectExists)
        {
            ModelState.AddModelError(nameof(request.SubjectId), "Предмет не найден.");
            return ValidationProblem(ModelState);
        }

        group.Name = request.Name.Trim();
        group.Description = NormalizeOptionalText(request.Description);
        group.SubjectId = request.SubjectId;
        group.PricePerLesson = request.PricePerLesson;
        group.StartsOn = request.StartsOn!.Value;
        group.EndsOn = request.EndsOn!.Value;
        group.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPatch("{id:int}/archive")]
    public async Task<IActionResult> ArchiveStudyGroup(int id)
    {
        var group = await _db.StudyGroups.FirstOrDefaultAsync(group => group.Id == id);

        if (group == null)
        {
            return NotFound();
        }

        group.Status = GroupStatus.Archived;
        group.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPost("{id:int}/members")]
    public async Task<ActionResult<GroupMemberDto>> AddMember(int id, AddGroupMemberRequest request)
    {
        var groupExists = await _db.StudyGroups.AnyAsync(group => group.Id == id);

        if (!groupExists)
        {
            return NotFound();
        }

        var userExists = await _db.Users.AnyAsync(user => user.Id == request.UserId);

        if (!userExists)
        {
            ModelState.AddModelError(nameof(request.UserId), "Пользователь не найден.");
            return ValidationProblem(ModelState);
        }

        var memberAlreadyExists = await _db.GroupMembers.AnyAsync(member =>
            member.GroupId == id && member.UserId == request.UserId
        );

        if (memberAlreadyExists)
        {
            ModelState.AddModelError(nameof(request.UserId), "Пользователь уже добавлен в группу.");
            return ValidationProblem(ModelState);
        }

        var member = new GroupMember
        {
            GroupId = id,
            UserId = request.UserId,
            Role = request.Role,
            CustomPrice = request.CustomPrice,
            JoinedAt = DateTime.UtcNow,
        };

        _db.GroupMembers.Add(member);
        await _db.SaveChangesAsync();

        var createdMember = await _db
            .GroupMembers.AsNoTracking()
            .Where(groupMember => groupMember.Id == member.Id)
            .Select(groupMember => new GroupMemberDto
            {
                Id = groupMember.Id,
                UserId = groupMember.UserId,
                UserName = groupMember.User.Name,
                UserLastName = groupMember.User.LastName,
                Role = groupMember.Role,
                CustomPrice = groupMember.CustomPrice,
                JoinedAt = groupMember.JoinedAt,
            })
            .FirstAsync();

        return CreatedAtAction(nameof(GetStudyGroupById), new { id }, createdMember);
    }

    [HttpDelete("{id:int}/members/{userId:guid}")]
    public async Task<IActionResult> RemoveMember(int id, Guid userId)
    {
        var member = await _db.GroupMembers.FirstOrDefaultAsync(member =>
            member.GroupId == id && member.UserId == userId
        );

        if (member == null)
        {
            return NotFound();
        }

        _db.GroupMembers.Remove(member);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private async Task<StudyGroupDetailsDto?> GetStudyGroupDetailsDto(int id)
    {
        return await _db
            .StudyGroups.AsNoTracking()
            .Where(group => group.Id == id)
            .Select(group => new StudyGroupDetailsDto
            {
                Id = group.Id,
                Name = group.Name,
                Description = group.Description,
                SubjectId = group.SubjectId,
                SubjectName = group.Subject.Name,
                PricePerLesson = group.PricePerLesson,
                StartsOn = group.StartsOn,
                EndsOn = group.EndsOn,
                Status = group.Status,
                StudentsCount = group.Members.Count(member =>
                    member.Role == GroupMemberRole.Student
                ),
                Members = group
                    .Members.OrderBy(member => member.Role)
                    .ThenBy(member => member.User.LastName)
                    .ThenBy(member => member.User.Name)
                    .Select(member => new GroupMemberDto
                    {
                        Id = member.Id,
                        UserId = member.UserId,
                        UserName = member.User.Name,
                        UserLastName = member.User.LastName,
                        Role = member.Role,
                        CustomPrice = member.CustomPrice,
                        JoinedAt = member.JoinedAt,
                    })
                    .ToList(),
                CreatedAt = group.CreatedAt,
                UpdatedAt = group.UpdatedAt,
            })
            .FirstOrDefaultAsync();
    }
}
