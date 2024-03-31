namespace Ebay.Server.Infrastructure;

using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Razor;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Routing;

internal class RazorPartialToStringRenderer
{
    private readonly IRazorViewEngine _viewEngine;
    private readonly ITempDataProvider _tempDataProvider;
    private readonly IServiceProvider _serviceProvider;

    public RazorPartialToStringRenderer(
        IRazorViewEngine viewEngine,
        ITempDataProvider tempDataProvider,
        IServiceProvider serviceProvider
    )
    {
        _viewEngine = viewEngine;
        _tempDataProvider = tempDataProvider;
        _serviceProvider = serviceProvider;
    }

    public async Task<string> RenderPartialToStringAsync<TModel>(string partialName, TModel model)
    {
        var actionContext = GetActionContext();
        var partial = FindView(actionContext: actionContext, partialName: partialName);
        await using var output = new StringWriter();
        var viewContext = new ViewContext(
            actionContext: actionContext,
            view: partial,
            viewData: new ViewDataDictionary<TModel>(
                metadataProvider: new EmptyModelMetadataProvider(),
                modelState: new ModelStateDictionary()
            )
            {
                Model = model
            },
            tempData: new TempDataDictionary(
                context: actionContext.HttpContext,
                provider: _tempDataProvider
            ),
            writer: output,
            htmlHelperOptions: new HtmlHelperOptions()
        );
        await partial.RenderAsync(viewContext);
        return output.ToString();
    }

    private IView FindView(ActionContext actionContext, string partialName)
    {
        var getPartialResult = _viewEngine.GetView(executingFilePath: null, viewPath: partialName, isMainPage: false);
        if (getPartialResult.Success)
        {
            return getPartialResult.View;
        }

        var findPartialResult = _viewEngine.FindView(context: actionContext, viewName: partialName, isMainPage: false);
        if (findPartialResult.Success)
        {
            return findPartialResult.View;
        }

        var searchedLocations = getPartialResult.SearchedLocations.Concat(findPartialResult.SearchedLocations);
        var errorMessage = string.Join(
            separator: Environment.NewLine,
            values: new[] { $"Unable to find partial '{partialName}'. The following locations were searched:" }.Concat(
                searchedLocations
            )
        );
        
        throw new InvalidOperationException(errorMessage);
    }

    private ActionContext GetActionContext()
    {
        var httpContext = new DefaultHttpContext
        {
            RequestServices = _serviceProvider
        };
        return new ActionContext(
            httpContext: httpContext,
            routeData: new RouteData(),
            actionDescriptor: new ActionDescriptor()
        );
    }
}