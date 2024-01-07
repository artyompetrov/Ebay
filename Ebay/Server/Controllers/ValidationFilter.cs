using Ebay.Server.Controllers.Generated;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Ebay.Server.Controllers;

public sealed class ValidationFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        if(!context.ModelState.IsValid)
        {
            var errorsInModelState = context.ModelState
                .Where(x => x.Value!.Errors.Count > 0)
                .ToDictionary(kvp => kvp.Key, kvp => kvp.Value!.Errors.Select(x => x.ErrorMessage).ToArray());

            var errors = new List<ValidationErrorResponseItem>();

            foreach (var error in errorsInModelState)
            {
                foreach (var subError in error.Value)
                {
                    var errorModel = new ValidationErrorResponseItem(fieldName: error.Key,message: subError);

                    errors.Add(errorModel);
                }

                context.Result = new BadRequestObjectResult(new ValidationErrorResponse("",errors)); //todo
                return;
            }
        }
        await next();
    }
}