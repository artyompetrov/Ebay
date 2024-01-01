using Ebay.Controllers.Generated;

namespace Ebay.Server.Controllers;

public class EbayControllerImplementation : IEbayController
{
    public Task<ICollection<WeatherForecast>> GetAllAsync() 
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
        
        return Task.FromResult<ICollection<WeatherForecast>>(result);
    }
}