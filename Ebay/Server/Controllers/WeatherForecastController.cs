using Ebay.GeneratedController.Controllers;
using Ebay.GeneratedController.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Ebay.Server.Controllers;

[Authorize]
public class WeatherForecastController : DefaultApiController
{
    
    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;
    }
    

    public override async Task<IActionResult> GetAll()
    {
        var result = 

        Enumerable.Range(0, 100).Select(
            x => new WeatherForecast
            {
                Date = x.ToString(),
                TemperatureC = x.ToString(),
                Summary = x.ToString(),
                TemperatureF = x.ToString()
            }).ToList();
        
        return Ok(result);
    }
}