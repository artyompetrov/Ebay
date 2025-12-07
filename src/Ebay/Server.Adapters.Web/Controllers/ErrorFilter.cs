using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Server.Controllers.Generated;

namespace Server.Adapters.Web.Controllers;

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

        _ = await next();
    }

    public void OnException(ExceptionContext context)
    {
        var exception = context.Exception;

        if (exception is NonOkHttpAnswerException nonOkHttpAnswerException)
        {
            context.Result = new ObjectResult(nonOkHttpAnswerException.ProblemDetails)
            {
                StatusCode = nonOkHttpAnswerException.ProblemDetails.Status
            };
        }
        else
        {
            var httpContext = context.HttpContext;

            var problemDetails = _problemDetailsFactory.CreateProblemDetails(
                httpContext: httpContext,
                type: "UnhandledError",
                statusCode: 500,
                title: exception.Message,
                detail: exception.ToString());

            context.Result = new ObjectResult(problemDetails)
            {
                StatusCode = problemDetails.Status
            };
        }


        context.ExceptionHandled = true;
    }
}