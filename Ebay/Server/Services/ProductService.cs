using Ebay.Server.Data;
using Ebay.Server.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace Ebay.Server.Services;

public class ProductService
{
    private readonly ApplicationDbContext _applicationContext;

    public ProductService(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }
    
    public async Task<ICollection<Product>> GetAllProducts() => await _applicationContext.Products.ToListAsync();
}