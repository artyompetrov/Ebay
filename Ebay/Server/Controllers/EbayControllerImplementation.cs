using System.ComponentModel.DataAnnotations;
using Ebay.Controllers.Generated;
using Ebay.Server.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DbProduct = Ebay.Server.Data.Models.Product;

namespace Ebay.Server.Controllers;

[ApiController]
public class EbayControllerImplementation : EbayControllerBase
{
    private readonly ApplicationDbContext _applicationContext;

    public EbayControllerImplementation(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public override async Task<ICollection<ProductWithId>> GetAllProducts(CancellationToken cancellationToken = default(CancellationToken))
    
    {
        var dbProducts = await _applicationContext.Products
            .OrderBy(x => x.Name).ThenBy(x => x.Id)
            .ToListAsync(cancellationToken);

        return dbProducts
            .Select(
                x => new ProductWithId
                {
                    Id = x.Id,
                    Name = x.Name,
                    SearchQuery = x.SearchQuery
                }).ToList();
    }

    public override async Task<Guid> CreateProduct(
        ProductWithoutId product,
        CancellationToken cancellationToken = default(CancellationToken))
    {
        var id = Guid.NewGuid();
        var dbProduct = new DbProduct { Id = id, Name = product.Name, SearchQuery = product.SearchQuery };

        await _applicationContext.Products.AddAsync(entity: dbProduct, cancellationToken: cancellationToken);
        await _applicationContext.SaveChangesAsync(cancellationToken);
        return id;
    }

    public override async Task UpdateProduct(
        ProductWithoutId product,
        Guid id,
        CancellationToken cancellationToken = default(CancellationToken))
    {
        var dbProduct = _applicationContext.Products.Attach(new DbProduct { Id = id });
        dbProduct.Entity.Name = product.Name;
        dbProduct.Entity.SearchQuery = product.SearchQuery;
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

    public override async Task DeleteProduct(Guid id, CancellationToken cancellationToken = default(CancellationToken))
    {
        var product = _applicationContext.Products.Attach(new DbProduct { Id = id });
        product.State = EntityState.Deleted;
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }

   
}