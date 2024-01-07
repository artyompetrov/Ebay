using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data;
using Microsoft.EntityFrameworkCore;
using DbProduct = Ebay.Server.Data.Models.Product;

namespace Ebay.Server.Controllers;

public class EbayControllerImplementation : IEbayController
{
    private readonly ApplicationDbContext _applicationContext;

    public EbayControllerImplementation(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public async Task<SwaggerResponse<ICollection<ProductWithId>>> GetAllProductsAsync(CancellationToken cancellationToken)

    {
        var dbProducts = await _applicationContext.Products
            .OrderBy(x => x.Name).ThenBy(x => x.Id)
            .ToListAsync(cancellationToken);

        return SwaggerResponse.Ok<ICollection<ProductWithId>>(dbProducts
            .Select(
                x => new ProductWithId(x.Id, x.Name, searchQuery: x.SearchQuery)).ToList());
    }

    public async Task<SwaggerResponse<Guid>> CreateProductAsync(
        ProductWithoutId product,
        CancellationToken cancellationToken)
    {
        var id = Guid.NewGuid();
        var dbProduct = new DbProduct { Id = id, Name = product.Name, SearchQuery = product.SearchQuery };

        await _applicationContext.Products.AddAsync(entity: dbProduct, cancellationToken: cancellationToken);
        await _applicationContext.SaveChangesAsync(cancellationToken);
        return SwaggerResponse.Created(id);
    }

    public async Task<SwaggerResponse> UpdateProductAsync(
        ProductWithoutId product,
        Guid id,
        CancellationToken cancellationToken)
    {
        var dbProduct = _applicationContext.Products.Attach(new DbProduct { Id = id });
        dbProduct.Entity.Name = product.Name;
        dbProduct.Entity.SearchQuery = product.SearchQuery;
        await _applicationContext.SaveChangesAsync(cancellationToken);

        return SwaggerResponse.Created(id);
    }

    public async Task<SwaggerResponse> DeleteProductAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = _applicationContext.Products.Attach(new DbProduct { Id = id });
        product.State = EntityState.Deleted;
        await _applicationContext.SaveChangesAsync(cancellationToken);
        
        return SwaggerResponse.NoContent();
    }
}