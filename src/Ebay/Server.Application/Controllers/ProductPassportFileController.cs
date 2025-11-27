using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;

namespace Server.Application.Controllers;

[ApiController]
public class ProductPassportFileController(ApplicationDbContext context) : ControllerBase
{
    private readonly ApplicationDbContext _context = context;

    [HttpGet("/products/{productId}/passports/{passportId}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken)
    {
        var passport = await _context.ProductPassports
            .AsNoTracking()
            .SingleOrDefaultAsync(
                predicate: x => x.ProductId == productId && x.Id == passportId,
                cancellationToken: cancellationToken);

        if (passport == null)
        {
            return NotFound();
        }

        // TODO: replace this manual controller with a Swagger-generated endpoint
        // once allowing anonymous access for passport files is properly supported.
        return File(passport.Content, passport.ContentType, passport.FileName);
    }
}
