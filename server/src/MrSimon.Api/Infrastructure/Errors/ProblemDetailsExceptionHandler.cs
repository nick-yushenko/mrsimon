using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace MrSimon.Api.Infrastructure.Errors;

public sealed class ProblemDetailsExceptionHandler : IExceptionHandler
{
    private readonly ILogger<ProblemDetailsExceptionHandler> _logger;
    private readonly ProblemDetailsFactory _problemDetailsFactory;

    public ProblemDetailsExceptionHandler(
        ILogger<ProblemDetailsExceptionHandler> logger,
        ProblemDetailsFactory problemDetailsFactory
    )
    {
        _logger = logger;
        _problemDetailsFactory = problemDetailsFactory;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken
    )
    {
        var statusCode =
            exception is AppException appException
                ? appException.StatusCode
                : StatusCodes.Status500InternalServerError;
        var code =
            exception is AppException appExceptionWithCode
                ? appExceptionWithCode.Code
                : ErrorCodes.InternalServerError;
        var title =
            exception is AppException
                ? exception.Message
                : ProblemDetailsDefaults.GetTitle(statusCode);

        if (statusCode >= StatusCodes.Status500InternalServerError)
        {
            _logger.LogError(exception, "Unhandled API exception");
        }

        var problemDetails = _problemDetailsFactory.CreateProblemDetails(
            httpContext,
            statusCode,
            title,
            ProblemDetailsDefaults.GetType(statusCode),
            exception is AppException ? exception.Message : null
        );

        problemDetails.Extensions["code"] = code;
        problemDetails.Extensions["traceId"] = httpContext.TraceIdentifier;

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/problem+json";

        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }
}
