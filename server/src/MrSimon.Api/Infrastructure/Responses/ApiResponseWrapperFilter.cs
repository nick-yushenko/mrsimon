using System.Reflection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using MrSimon.Api.Dtos.Common;
using MrSimon.Api.Infrastructure.Errors;

namespace MrSimon.Api.Infrastructure.Responses;

public sealed class ApiResponseWrapperFilter : IResultFilter
{
    private readonly ProblemDetailsFactory _problemDetailsFactory;

    public ApiResponseWrapperFilter(ProblemDetailsFactory problemDetailsFactory)
    {
        _problemDetailsFactory = problemDetailsFactory;
    }

    public void OnResultExecuting(ResultExecutingContext context)
    {
        switch (context.Result)
        {
            case ObjectResult objectResult:
                HandleObjectResult(context.HttpContext, objectResult);
                break;
            case StatusCodeResult statusCodeResult:
                context.Result = CreateResultForStatusCode(
                    context.HttpContext,
                    statusCodeResult.StatusCode
                );
                break;
        }
    }

    public void OnResultExecuted(ResultExecutedContext context) { }

    private void HandleObjectResult(HttpContext httpContext, ObjectResult objectResult)
    {
        var statusCode = objectResult.StatusCode ?? StatusCodes.Status200OK;

        if (statusCode >= StatusCodes.Status200OK && statusCode < StatusCodes.Status300MultipleChoices)
        {
            objectResult.Value = WrapSuccessValue(objectResult.Value);
            return;
        }

        if (objectResult.Value is ProblemDetails problemDetails)
        {
            ProblemDetailsDefaults.EnsureExtensions(problemDetails, httpContext);
            return;
        }

        objectResult.Value = CreateProblemDetails(
            httpContext,
            statusCode,
            GetMessage(objectResult.Value)
        );
    }

    private IActionResult CreateResultForStatusCode(HttpContext httpContext, int statusCode)
    {
        if (statusCode == StatusCodes.Status204NoContent)
        {
            return new OkObjectResult(new ApiResponse<object?> { Data = null });
        }

        if (statusCode >= StatusCodes.Status400BadRequest)
        {
            return new ObjectResult(CreateProblemDetails(httpContext, statusCode))
            {
                StatusCode = statusCode,
            };
        }

        return new StatusCodeResult(statusCode);
    }

    private static ApiResponse<object?> WrapSuccessValue(object? value)
    {
        if (value is IPagedResult pagedResult)
        {
            return new ApiResponse<object?>
            {
                Data = pagedResult.GetItems(),
                Meta = pagedResult.GetMeta(),
            };
        }

        return new ApiResponse<object?> { Data = value };
    }

    private ProblemDetails CreateProblemDetails(
        HttpContext httpContext,
        int statusCode,
        string? message = null
    )
    {
        var problemDetails = _problemDetailsFactory.CreateProblemDetails(
            httpContext,
            statusCode,
            message ?? ProblemDetailsDefaults.GetTitle(statusCode),
            ProblemDetailsDefaults.GetType(statusCode),
            message
        );

        ProblemDetailsDefaults.EnsureExtensions(problemDetails, httpContext);

        return problemDetails;
    }

    private static string? GetMessage(object? value)
    {
        if (value is null)
        {
            return null;
        }

        if (value is string message)
        {
            return message;
        }

        var messageProperty = value.GetType().GetProperty(
            "message",
            BindingFlags.IgnoreCase | BindingFlags.Instance | BindingFlags.Public
        );

        return messageProperty?.GetValue(value)?.ToString();
    }
}
