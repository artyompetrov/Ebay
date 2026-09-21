using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain.Measurements;

namespace Server.Application.Consumers.PriceCalculator;

public class CalculateMetricsForProductConsumer : IConsumer<Batch<CalculateMetricsForProduct>>
{
    private readonly IProductQueries _productQueries;
    private readonly IProductRepository _productRepository;
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly ILogger<CalculateMetricsForProductConsumer> _logger;

    public CalculateMetricsForProductConsumer(
        IProductQueries productQueries,
        IProductRepository productRepository,
        IWriteModelUnitOfWork unitOfWork,
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

            var publishedThreshold = DateTimeOffset.UtcNow.AddDays(-7);
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

            var product = await _productRepository.GetByIdAsync(productId, context.CancellationToken);

            if (product == null)
            {
                _logger.LogWarning("Product with id {ProductId} not found", productId);
                return;
            }

            product.RecalculateMetrics(lotCalculationResults, unpublishedOnEbayCountCreated, unpublishedOnEbayCountSelling);

            await _unitOfWork.SaveChangesAsync(context.CancellationToken);
        }
    }
}