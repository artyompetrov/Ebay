using Ebay.Controllers.Generated;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Ebay.Server.Infrastructure;

public sealed class ValidationFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if(!context.ModelState.IsValid)
        {
            var errorsInModelState = context.ModelState
                .Where(x => x.Value!.Errors.Count > 0)
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value!.Errors.Select(x => x.ErrorMessage).ToArray());

            var errorResponse = new ValidationErrorResponse();

            foreach (var error in errorsInModelState)
            {
                foreach (var subError in error.Value)
                {
                    var errorModel = new ValidationErrorResponseItem
                    {
                        FieldName = error.Key,
                        Message = subError
                    };

                    errorResponse.ValidationErrors.Add(errorModel);
                }

                context.Result = new BadRequestObjectResult(errorResponse);
                return;
            }
        }
        await next();
    }
}