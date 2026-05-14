using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MrSimon.Api.Data;
using MrSimon.Api.Dtos.Common;
using MrSimon.Api.Dtos.Users;
using MrSimon.Api.Infrastructure.Errors;

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
        [FromQuery] string? search = null,
        [FromQuery] string? role = null
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

        if (!string.IsNullOrWhiteSpace(role))
        {
					  // TODO добавить проверку, что роль действительно существует - иначе не фильтровать
            var normalizedRole = role.Trim();
            query = query.Where(user => user.Role == normalizedRole);
        }

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
            throw new AppException(
                ErrorCodes.UserNotFound,
                "Пользователь не найден",
                StatusCodes.Status404NotFound
            );
        }

        return Ok(user);
    }

    [HttpGet("summary")]
    public async Task<ActionResult<SummaryDto>> GetSummary()
    {
        var now = DateTime.UtcNow;
        var currentMonthStart = new DateTime(now.Year, now.Month, 1, 0, 0, 0, DateTimeKind.Utc);
        var nextMonthStart = currentMonthStart.AddMonths(1);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var firstMonthStart = currentMonthStart.AddMonths(-11);

        var monthlyCounts = await _db
            .Users.AsNoTracking()
            .Where(user => user.CreatedAt >= firstMonthStart && user.CreatedAt < nextMonthStart)
            .GroupBy(user => new { user.CreatedAt.Year, user.CreatedAt.Month })
            .Select(group => new
            {
                group.Key.Year,
                group.Key.Month,
                Count = group.Count(),
            })
            .ToListAsync();

        var countsByMonth = monthlyCounts.ToDictionary(
            item => (item.Year, item.Month),
            item => item.Count
        );

        var currentMonthCount = countsByMonth.GetValueOrDefault(
            (currentMonthStart.Year, currentMonthStart.Month)
        );
        var previousMonthCount = countsByMonth.GetValueOrDefault(
            (previousMonthStart.Year, previousMonthStart.Month)
        );

        var summary = new SummaryDto
        {
            Total = await _db.Users.CountAsync(),
            MonthlyGrowthPercent = CalculateGrowthPercent(currentMonthCount, previousMonthCount),
            MonthlyCounts = Enumerable
                .Range(0, 12)
                .Select(offset =>
                {
                    var month = firstMonthStart.AddMonths(offset);

                    return new MonthlyUsersCountDto
                    {
                        Year = month.Year,
                        Month = month.Month,
                        Count = countsByMonth.GetValueOrDefault((month.Year, month.Month)),
                    };
                })
                .ToList(),
        };

        return Ok(summary);
    }

    private static decimal CalculateGrowthPercent(int currentValue, int previousValue)
    {
        if (previousValue == 0)
        {
            return currentValue == 0 ? 0 : 100;
        }

        return Math.Round(((decimal)(currentValue - previousValue) / previousValue) * 100, 2);
    }
}

public record CreateUserRequest(string Name);
