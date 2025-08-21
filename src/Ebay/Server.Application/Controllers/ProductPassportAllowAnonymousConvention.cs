using System;
using System.Linq;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.Authorization;

namespace Server.Application.Controllers;

public class ProductPassportAllowAnonymousConvention : IActionModelConvention
{
    public void Apply(ActionModel action)
    {
        var template = action.Selectors.FirstOrDefault()?.AttributeRouteModel?.Template;
        if (string.Equals(template, "products/{productId}/passports/{passportId}/", StringComparison.OrdinalIgnoreCase))
        {
            action.Filters.Add(new AllowAnonymousFilter());
        }
    }
}
