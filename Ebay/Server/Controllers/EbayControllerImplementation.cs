using Ebay.Controllers.Generated;
using Ebay.Server.Services;

namespace Ebay.Server.Controllers;

public class EbayControllerImplementation : IEbayController
{
    private readonly ProductService _productService;

    public EbayControllerImplementation(ProductService productService)
    {
        _productService = productService;
    }

    public async Task<ICollection<Product>> GetAllProductsAsync()
    {
        return (await _productService.GetAllProducts())
            .Select(x => new Product
            {
                Id = x.Id,
                Name = x.Name,
                SearchQuery = x.SearchQuery
            }).ToList();
    }
}