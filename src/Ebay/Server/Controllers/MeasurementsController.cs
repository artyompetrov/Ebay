using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

public class MeasurementsController : Controller
{

    private readonly ILogger<MeasurementsController> _logger;

    public MeasurementsController(
        ILogger<MeasurementsController> logger)
    {
        _logger = logger;
    }

    [HttpGet("m/{measurementId}")]
    public IActionResult GetClientRequestParameters([FromRoute] string measurementId)
    {
        return Ok(measurementId);
    }
}