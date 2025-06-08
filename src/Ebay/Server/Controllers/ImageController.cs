using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ScottPlot;
using Server.Data;

namespace Server.Controllers;

[ApiController]
[Route("/m/")]
public class ImageController : ControllerBase
{
    private readonly ApplicationDbContext _applicationContext;

    public ImageController(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }
    
    [HttpGet("{measurementId}/anode_curves")]
    public async Task<IActionResult> Get(string measurementId)
    {
        var measurements = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Where(x => x.Id == measurementId)
            .Select(x=>x.Measurements)
            .SingleOrDefaultAsync();
        
        
        
        if (measurements == null) return NotFound();
        
        var plt = new Plot();
        double[] xs = [1, 2, 3, 4, 5];
        double[] ys = [1, 4, 9, 16, 25];
        plt.Add.Scatter(xs, ys);
        plt.Title("y = x^2");
        plt.XLabel("X");
        plt.YLabel("Y");
        
        var pngBytes = plt.GetImageBytes(300, 300, ImageFormat.Png);

        return File(pngBytes, "image/png");
    }
}