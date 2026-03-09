using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;
using Server.Domain.Measurements;

namespace Server.Application.Consumers.PriceCalculator;

public class CalculateMetricsForProductConsumer : IConsumer<Batch<CalculateMetricsForProduct>>
{
    private readonly IProductQueries _productQueries;
    private readonly IProductRepository _productRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CalculateMetricsForProductConsumer> _logger;

    public CalculateMetricsForProductConsumer(
        IProductQueries productQueries,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        ILogger<CalculateMetricsForProductConsumer> logger)
    {
        _productQueries = productQueries;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task Consume(ConsumeContext<Batch<CalculateMetricsForProduct>> context)
    {
        var productsIds = context.Message.Select(x => x.Message.ProductId).ToHashSet();

        foreach (var productId in productsIds)
        {
            var lotCalculationResults = await _productQueries.GetLotCalculationResultsAsync(productId, context.CancellationToken);

            var revenue = 0.0;
            var listingPrice = 0.0;
            var quantityTotal = 0;

            var dateTime = DateTime.UtcNow;
            var publishedThreshold = DateTime.UtcNow.AddDays(-7);
            var unpublishedOnEbayCountCreated = await _productQueries.GetUnpublishedOnEbayCountAsync(
                productId,
                MeasurementState.Created,
                publishedThreshold,
                context.CancellationToken);
            var unpublishedOnEbayCountSelling = await _productQueries.GetUnpublishedOnEbayCountAsync(
                productId,
                MeasurementState.Selling,
                publishedThreshold,
                context.CancellationToken);

            foreach (var lotCalculationResult in lotCalculationResults)
            {
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
                _logger.LogWarning("Product with id {ProductId} not found", productId);
                return;
            }

            product.ProductCalculationResult = new ProductCalculationResult
            {
                Revenue = revenue,
                QuantityTotal = quantityTotal,
                CalculationDate = dateTime,
                ListingPriceSumm = listingPrice,
                UnpublishedOnEbayCountCreated = unpublishedOnEbayCountCreated,
                UnpublishedOnEbayCountSelling = unpublishedOnEbayCountSelling
            };

            await _unitOfWork.SaveChangesAsync(context.CancellationToken);
        }
    }
}

public record CalculateMetricsForProduct(Guid ProductId);
