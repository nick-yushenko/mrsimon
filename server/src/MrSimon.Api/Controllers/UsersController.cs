using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrSimon.Api.Data;
using MrSimon.Api.Dtos.Common;
using MrSimon.Api.Dtos.Users;

namespace MrSimon.Api.Controllers;

// [Authorize]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsersController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<UserListItemDto>>> GetUsers(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null
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

        var query = _db.Users.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var normalizedSearch = search.Trim().ToLower();

            query = query.Where(user =>
                user.Name.ToLower().Contains(normalizedSearch)
                || user.LastName.ToLower().Contains(normalizedSearch)
                || user.Email.ToLower().Contains(normalizedSearch)
            );
        }

        query = query.OrderByDescending(user => user.CreatedAt);

        var totalCount = await query.CountAsync();

        var users = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(user => new UserListItemDto
            {
                Id = user.Id,
                Name = user.Name,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                CreatedAt = user.CreatedAt,
                UpdatedAt = user.UpdatedAt,
            })
            .ToListAsync();

        var result = new PagedResult<UserListItemDto>
        {
            Items = users,
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
            TotalPages = (int)Math.Ceiling(totalCount / (double)pageSize),
        };

        return Ok(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<UserDetailsDto>> GetUserById(Guid id)
    {
        var user = await _db
            .Users.AsNoTracking()
            .Where(u => u.Id == id)
            .Select(u => new UserDetailsDto
            {
                Id = u.Id,
                Name = u.Name,
                LastName = u.LastName,
                Email = u.Email,
                Role = u.Role,
                Note = u.Note,
                CreatedAt = u.CreatedAt,
                UpdatedAt = u.UpdatedAt,
            })
            .FirstOrDefaultAsync();

        if (user == null)
        {
            return NotFound();
        }

        return Ok(user);
    }
}

public record CreateUserRequest(string Name);
