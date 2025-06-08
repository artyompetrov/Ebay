using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Data.Models;

namespace Server.Pages;

public class MeasurementPage : PageModel
{
    private readonly ApplicationDbContext _applicationContext;

    //конструктор обязательно должен быть public
    public MeasurementPage(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }
    
    internal ProductMeasurement? Measurement { get; set; }

    public async Task OnGet(string measurementId)
    {

        //todo извлекать только нужные поля
        Measurement = await _applicationContext.ProductMeasurements
            .AsNoTracking()
            .Include(x=>x.Product)
            .ThenInclude(x=>x.SearchQueries)
            .SingleOrDefaultAsync(x => x.Id == measurementId);
    }
}