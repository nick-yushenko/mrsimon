using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrSimon.Api.Data;
using MrSimon.Api.Dtos.Subjects;
using MrSimon.Api.Models;

namespace MrSimon.Api.Controllers;

// [Authorize]
[ApiController]
[Route("api/subjects")]
public class SubjectsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SubjectsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<List<SubjectDto>>> GetSubjects()
    {
        var subjects = await _db
            .Subjects.AsNoTracking()
            .OrderBy(subject => subject.Name)
            .Select(subject => new SubjectDto
            {
                Id = subject.Id,
                Name = subject.Name,
                Description = subject.Description,
                GroupsCount = subject.Groups.Count,
                CreatedAt = subject.CreatedAt,
                UpdatedAt = subject.UpdatedAt,
            })
            .ToListAsync();

        return Ok(subjects);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SubjectDto>> GetSubjectById(int id)
    {
        var subject = await _db
            .Subjects.AsNoTracking()
            .Where(subject => subject.Id == id)
            .Select(subject => new SubjectDto
            {
                Id = subject.Id,
                Name = subject.Name,
                Description = subject.Description,
                GroupsCount = subject.Groups.Count,
                CreatedAt = subject.CreatedAt,
                UpdatedAt = subject.UpdatedAt,
            })
            .FirstOrDefaultAsync();

        if (subject == null)
        {
            return NotFound();
        }

        return Ok(subject);
    }

    [HttpPost]
    public async Task<ActionResult<SubjectDto>> CreateSubject(CreateSubjectRequest request)
    {
        var normalizedName = request.Name.Trim();
        var nameAlreadyExists = await _db.Subjects.AnyAsync(subject =>
            subject.Name.ToLower() == normalizedName.ToLower()
        );

        if (nameAlreadyExists)
        {
            ModelState.AddModelError(
                nameof(request.Name),
                "Дисциплина с таким названием уже есть."
            );
            return ValidationProblem(ModelState);
        }

        var subject = new Subject
        {
            Name = normalizedName,
            Description = NormalizeOptionalText(request.Description),
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        _db.Subjects.Add(subject);
        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetSubjectById),
            new { id = subject.Id },
            new SubjectDto
            {
                Id = subject.Id,
                Name = subject.Name,
                Description = subject.Description,
                GroupsCount = 0,
                CreatedAt = subject.CreatedAt,
                UpdatedAt = subject.UpdatedAt,
            }
        );
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSubject(int id)
    {
        var subject = await _db.Subjects.FirstOrDefaultAsync(subject => subject.Id == id);

        if (subject == null)
        {
            return NotFound();
        }

        var hasGroups = await _db.StudyGroups.AnyAsync(group => group.SubjectId == id);

        if (hasGroups)
        {
            return Conflict(
                new { message = "Нельзя удалить дисциплину, к которой уже привязаны группы." }
            );
        }

        _db.Subjects.Remove(subject);
        await _db.SaveChangesAsync();

        return NoContent();
    }

    private static string? NormalizeOptionalText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
