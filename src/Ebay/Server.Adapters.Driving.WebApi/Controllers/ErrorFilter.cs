using System.Diagnostics;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Server.Adapters.Driving.WebApi.Generated;

namespace Server.Adapters.Driving.WebApi.Controllers;

public sealed class ErrorFilter : IAsyncActionFilter, IExceptionFilter
{
    private readonly ProblemDetailsFactory _problemDetailsFactory;

    public ErrorFilter(ProblemDetailsFactory problemDetailsFactory)
    {
        _problemDetailsFactory = problemDetailsFactory;
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if (!context.ModelState.IsValid)
        {
            var problemDetails = _problemDetailsFactory.CreateValidationProblemDetails(
                httpContext: context.HttpContext,
                modelStateDictionary: context.ModelState,
                type: nameof(ValidationProblemDetailedInfo),
                statusCode: 400);

            context.Result = new ObjectResult(problemDetails)
            {
                StatusCode = problemDetails.Status
            };

            return;
        }

        await next();
    }

    public void OnException(ExceptionContext context)
    {
        // Expected failures come back as OneOf results and are answered by the controllers;
        // only exceptions of libraries and infrastructure (database, network) reach this point.
        var exception = context.Exception;

        // The exception is handled here, so the tracing instrumentation never sees it: record it on the request's span.
        var requestSpan = context.HttpContext.Features.Get<IHttpActivityFeature>()?.Activity;
        requestSpan?.SetStatus(ActivityStatusCode.Error, exception.Message);
        requestSpan?.AddException(exception);

        var problemDetails = _problemDetailsFactory.CreateProblemDetails(
            httpContext: context.HttpContext,
            type: "UnhandledError",
            statusCode: 500,
            title: exception.Message,
            detail: exception.ToString());

        context.Result = new ObjectResult(problemDetails)
        {
            StatusCode = problemDetails.Status
        };

        context.ExceptionHandled = true;
    }
}
