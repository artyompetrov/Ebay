using System.Data;
using MassTransit;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Queries;
using Server.Application.Abstractions.Repositories;
using Server.Application.Consumers.PriceCalculator;
using Server.Domain;

namespace Server.Application.Services;

internal class ProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IProductRepository _productRepository;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IProductQueries _productQueries;

    public ProductService(
        IUnitOfWork unitOfWork,
        IProductRepository productRepository,
        IPublishEndpoint publishEndpoint,
        IProductQueries productQueries
        )
    {
        _unitOfWork = unitOfWork;
        _productRepository = productRepository;
        _publishEndpoint = publishEndpoint;
        _productQueries = productQueries;
    }

    public async Task<Product> CreateProductAsync(
        string name,
        int weight,
        IReadOnlyList<string> searchQueries,
        IReadOnlyList<string> ruSearchQueries,
        CancellationToken cancellationToken)
    {
        var product = Product.Create(
            name: name,
            weight: weight,
            searchQueries: searchQueries,
            ruSearchQueries: ruSearchQueries);

        await _productRepository.SaveAsync(aggregate: product, cancellationToken: cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken: cancellationToken);
        return product;
    }

    public async Task UpdateProductAsync(
        Guid productId,
        string name,
        int weight,
        IReadOnlyList<SearchQueryWithId> searchQueries,
        IReadOnlyList<SearchQueryWithId> ruSearchQueries,
        CancellationToken cancellationToken
    )
    {
        await using var transaction = await _unitOfWork.BeginTransactionAsync(cancellationToken, IsolationLevel.RepeatableRead);

        var product = await _productRepository.GetByIdAsync(id: productId, cancellationToken: cancellationToken);

        if (product == null)
        {
            throw new ApplicationException("product not found");
        }

        product.Update(name: name, weight: weight, searchQueries: searchQueries, ruSearchQueries: ruSearchQueries);

        // todo переделать в доменное событие 
        await _publishEndpoint.Publish(new CalculatePricesForProduct(productId), cancellationToken);

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        await transaction.CommitAsync(cancellationToken);
    }

    public async Task DeleteProductAsync(Guid id,
        CancellationToken cancellationToken)
    {
        await _productRepository.RemoveAsync(id, cancellationToken);
    }

    public async Task MarkProductAsCheckedAsync(
        Guid id,
        CancellationToken cancellationToken
    )
    {
        var product = await _productRepository.GetByIdAsync(id, cancellationToken);

        if (product == null)
        {
            throw new ApplicationException("Product not found");
        }

        product.MarkAsChecked();

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<ProductInfo?> GetProductAsync(Guid id, CancellationToken cancellationToken)
    {
        var product = await _productQueries.GetProductAsync(id, cancellationToken);

        return product;
    }

    public async Task<IReadOnlyList<ProductInfo>> GetAllProductsAsync(CancellationToken cancellationToken)
    {
        var result = await _productQueries.GetAllProductsAsync(cancellationToken);
        return result;
    }
}