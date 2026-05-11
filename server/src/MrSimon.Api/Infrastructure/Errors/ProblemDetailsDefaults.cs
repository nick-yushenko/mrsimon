using Microsoft.AspNetCore.Mvc;

namespace MrSimon.Api.Infrastructure.Errors;

public static class ProblemDetailsDefaults
{
    public const string ValidationType = "https://mrsimon.local/problems/validation-error";

    public static string GetType(int statusCode)
    {
        return statusCode switch
        {
            StatusCodes.Status400BadRequest => "https://mrsimon.local/problems/bad-request",
            StatusCodes.Status401Unauthorized => "https://mrsimon.local/problems/unauthorized",
            StatusCodes.Status403Forbidden => "https://mrsimon.local/problems/forbidden",
            StatusCodes.Status404NotFound => "https://mrsimon.local/problems/not-found",
            StatusCodes.Status409Conflict => "https://mrsimon.local/problems/conflict",
            _ => "https://mrsimon.local/problems/internal-server-error",
        };
    }

    public static string GetTitle(int statusCode)
    {
        return statusCode switch
        {
            StatusCodes.Status400BadRequest => "Некорректный запрос",
            StatusCodes.Status401Unauthorized => "Пользователь не авторизован",
            StatusCodes.Status403Forbidden => "Доступ запрещен",
            StatusCodes.Status404NotFound => "Ресурс не найден",
            StatusCodes.Status409Conflict => "Конфликт данных",
            _ => "Внутренняя ошибка сервера",
        };
    }

    public static string GetCode(int statusCode)
    {
        return statusCode switch
        {
            StatusCodes.Status400BadRequest => ErrorCodes.BadRequest,
            StatusCodes.Status401Unauthorized => ErrorCodes.Unauthorized,
            StatusCodes.Status403Forbidden => ErrorCodes.Forbidden,
            StatusCodes.Status404NotFound => ErrorCodes.NotFound,
            StatusCodes.Status409Conflict => ErrorCodes.Conflict,
            _ => ErrorCodes.InternalServerError,
        };
    }

    public static void EnsureExtensions(ProblemDetails problemDetails, HttpContext httpContext)
    {
        var statusCode = problemDetails.Status ?? StatusCodes.Status500InternalServerError;

        if (problemDetails is ValidationProblemDetails)
        {
            problemDetails.Type = ValidationType;
            problemDetails.Title = "Ошибка валидации";
            problemDetails.Extensions.TryAdd("code", ErrorCodes.ValidationError);
        }
        else
        {
            problemDetails.Type ??= GetType(statusCode);
            problemDetails.Title ??= GetTitle(statusCode);
            problemDetails.Extensions.TryAdd("code", GetCode(statusCode));
        }

        problemDetails.Extensions.TryAdd("traceId", httpContext.TraceIdentifier);
    }
}
