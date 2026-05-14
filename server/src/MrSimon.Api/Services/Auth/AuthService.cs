using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MrSimon.Api.Data;
using MrSimon.Api.Dtos.Auth;
using MrSimon.Api.Infrastructure.Errors;
using MrSimon.Api.Models;

namespace MrSimon.Api.Services.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _configuration;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public AuthService(
        AppDbContext db,
        PasswordHasher<User> passwordHasher,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _configuration = configuration;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower();

        var emailAlreadyExists = await _db.Users.AnyAsync(user =>
            user.Email.ToLower() == normalizedEmail
        );

        if (emailAlreadyExists)
        {
            throw new AppException(
                ErrorCodes.EmailAlreadyExists,
                "Пользователь с таким email уже существует",
                StatusCodes.Status409Conflict
            );
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Name = request.Name.Trim(),
            LastName = request.LastName.Trim(),
            Email = normalizedEmail,
            Role = "User",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, request.Password);

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var normalizedEmail = request.Email.Trim().ToLower();

        var user = await _db.Users.FirstOrDefaultAsync(user =>
            user.Email.ToLower() == normalizedEmail
        );

        if (user is null)
        {
            throw new AppException(
                ErrorCodes.InvalidCredentials,
                "Неверный email или пароль",
                StatusCodes.Status401Unauthorized
            );
        }

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            request.Password
        );

        if (result == PasswordVerificationResult.Failed)
        {
            throw new AppException(
                ErrorCodes.InvalidCredentials,
                "Неверный email или пароль",
                StatusCodes.Status401Unauthorized
            );
        }

        return CreateAuthResponse(user);
    }

    public async Task<UserDto> GetCurrentUserAsync()
    {
        var httpContext = _httpContextAccessor.HttpContext;

        if (httpContext?.User.Identity?.IsAuthenticated != true)
        {
            throw new AppException(
                ErrorCodes.Unauthorized,
                "Пользователь не авторизован",
                StatusCodes.Status401Unauthorized
            );
        }

        var userIdValue = httpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!Guid.TryParse(userIdValue, out var userId))
        {
            throw new AppException(
                ErrorCodes.InvalidToken,
                "Некорректный токен",
                StatusCodes.Status401Unauthorized
            );
        }

        var user = await _db.Users.FirstOrDefaultAsync(user => user.Id == userId);

        if (user is null)
        {
            throw new AppException(
                ErrorCodes.UserNotFound,
                "Пользователь не найден",
                StatusCodes.Status404NotFound
            );
        }

        return ToUserDto(user);
    }

    private AuthResponse CreateAuthResponse(User user)
    {
        return new AuthResponse { User = ToUserDto(user), AccessToken = CreateAccessToken(user) };
    }

    private string CreateAccessToken(User user)
    {
        var jwtKey = _configuration["Jwt:Key"];

        if (string.IsNullOrWhiteSpace(jwtKey))
        {
            throw new Exception("Jwt:Key не настроен");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, $"{user.Name} {user.LastName}"),
            new(ClaimTypes.Role, user.Role),
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto ToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
        };
    }
}
