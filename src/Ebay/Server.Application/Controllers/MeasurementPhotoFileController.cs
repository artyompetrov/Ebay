using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;

namespace Server.Application.Controllers;

[ApiController]
public class MeasurementPhotoFileController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public MeasurementPhotoFileController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("/measurements/{measurementId}/photos/{photoId}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        var photo = await _context.MeasurementPhotos
            .AsNoTracking()
            .SingleOrDefaultAsync(
                predicate: x => x.MeasurementId == measurementId && x.Id == photoId,
                cancellationToken: cancellationToken);

        if (photo == null)
        {
            return NotFound();
        }

        return File(photo.Content, photo.ContentType, photo.FileName);
    }
}
