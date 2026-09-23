using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions.Driven.Abstractions.Queries;

namespace Server.Adapters.Driving.WebApi.Controllers;

[ApiController]
public class ProductPassportFileController : ControllerBase
{
    private readonly IPassportQueries _passportQueries;

    public ProductPassportFileController(IPassportQueries passportQueries)
    {
        _passportQueries = passportQueries;
    }

    [HttpGet("/products/{productId}/passports/{passportId}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken)
    {
        var passport = await _passportQueries.GetPassportFileAsync(productId, passportId, cancellationToken);

        if (passport == null)
        {
            return NotFound();
        }

        // TODO: replace this manual controller with a Swagger-generated endpoint
        // once allowing anonymous access for passport files is properly supported.
        return File(passport.Content, passport.ContentType, passport.FileName);
    }
}
