using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;

namespace Server.Application.Controllers;

[ApiController]
public class MeasurementPhotoFileController : ControllerBase
{
    private readonly IMeasurementPhotoRepository _measurementPhotoRepository;

    public MeasurementPhotoFileController(IMeasurementPhotoRepository measurementPhotoRepository)
    {
        _measurementPhotoRepository = measurementPhotoRepository;
    }

    [HttpGet("/measurements/{measurementId}/photos/{photoId}")]
    [AllowAnonymous]
    public async Task<IActionResult> Get(
        string measurementId,
        Guid photoId,
        CancellationToken cancellationToken)
    {
        var photo = await _measurementPhotoRepository.Get(measurementId, photoId, cancellationToken);

        if (photo == null)
        {
            return NotFound();
        }

        return File(photo.Content, photo.ContentType, photo.FileName);
    }
}
