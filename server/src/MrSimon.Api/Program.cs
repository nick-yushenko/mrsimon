using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MrSimon.Api.Data;
using MrSimon.Api.Models;
using MrSimon.Api.Services.Auth;

var builder = WebApplication.CreateBuilder(args);

// ================================
// Database
// ================================

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// ================================
// Controllers
// ================================

builder.Services.AddControllers();

// ================================
// Application services
// ================================

// Дает доступ к текущему HttpContext внутри сервисов.
// Нужен AuthService, чтобы вызывать SignInAsync / SignOutAsync.
builder.Services.AddHttpContextAccessor();

// Хэширование и проверка паролей.
builder.Services.AddScoped<PasswordHasher<User>>();

// Сервис авторизации.
builder.Services.AddScoped<IAuthService, AuthService>();

// ================================
// Authentication / Authorization
// ================================

var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new Exception("Jwt:Key не настроен");
}

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],

            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],

            ValidateLifetime = true,

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),

            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

// ================================
// CORS
// ================================

// Нужно, если frontend и backend работают на разных портах.
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "Client",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000", "https://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});

// ================================
// Swagger
// ================================

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ================================
// Middleware pipeline
// ================================

// Swagger UI для разработки.
app.UseSwagger();
app.UseSwaggerUI();

// Редирект с http на https.
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("Client");

// Сначала проверяем, есть ли auth-cookie и кто пользователь.
app.UseAuthentication();

// Потом проверяем, имеет ли пользователь доступ к endpoint.
app.UseAuthorization();

// ================================
// Endpoints
// ================================

app.MapControllers();

app.MapGet(
    "/health",
    () =>
        Results.Ok(
            new
            {
                status = "ok",
                service = "MrSimon.Api",
                timestamp = DateTimeOffset.UtcNow,
            }
        )
);

app.Run();
