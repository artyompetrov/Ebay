using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain;

namespace Server.Application.Consumers.PriceCalculator;

internal class CalculateTotalAveragePriceForProductConsumer : IConsumer<Batch<CalculateTotalAveragePriceForProduct>>
{
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CalculateTotalAveragePriceForProductConsumer> _logger;

    public CalculateTotalAveragePriceForProductConsumer(
        ApplicationDbContext applicationDbContext,
        IProductRepository  productRepository,
        IUnitOfWork unitOfWork,
        ILogger<CalculateTotalAveragePriceForProductConsumer> logger)
    {
        _applicationDbContext = applicationDbContext;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<Batch<CalculateTotalAveragePriceForProduct>> context)
    {
        var productsIds = context.Message.Select(x => x.Message.ProductId).ToHashSet();

        foreach (var productId in productsIds)
        {
            var lotCalculationResults = await _applicationDbContext.Lots.AsNoTracking()
                .Where(x => x.ProductId == productId && x.LotCalculationResult != null)
                .Select(x => x.LotCalculationResult)
                .ToListAsync(context.CancellationToken);

            var revenue = 0.0;
            var listingPrice = 0.0;
            var quantityTotal = 0;

            var dateTime = DateTime.UtcNow;
            foreach (var lotCalculationResult in lotCalculationResults)
            {
                if (lotCalculationResult == null) throw new NullReferenceException(nameof(lotCalculationResults));
                revenue += lotCalculationResult.Revenue;
                listingPrice += lotCalculationResult.ListingPriceSumm;
                quantityTotal += lotCalculationResult.QuantityTotal;

                if (dateTime > lotCalculationResult.CalculationDate)
                {
                    dateTime = lotCalculationResult.CalculationDate;
                }
            }

            var product = await _productRepository.GetByIdAsync(productId, context.CancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product with id {productId} not found", productId);
                return;
            }
            
            product.ProductCalculationResult = new ProductCalculationResult
            {
                Revenue = revenue,
                QuantityTotal = quantityTotal,
                CalculationDate = dateTime,
                ListingPriceSumm = listingPrice
            };

            await _unitOfWork.SaveChangesAsync(context.CancellationToken);

            await _applicationDbContext.SaveChangesAsync(context.CancellationToken);
        }
    }
}

public record CalculateTotalAveragePriceForProduct(Guid ProductId);