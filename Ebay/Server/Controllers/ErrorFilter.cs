using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Ebay.Server.Controllers;

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
        var exception = context.Exception;
        var httpContext = context.HttpContext;

        var problemDetails = _problemDetailsFactory.CreateProblemDetails(
            httpContext: httpContext,
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