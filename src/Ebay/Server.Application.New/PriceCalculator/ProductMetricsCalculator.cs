using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain.Measurements;

namespace Server.Application.New.PriceCalculator;

/// <summary>
/// Пересчитывает агрегированные метрики товара на основании результатов расчета его лотов.
/// </summary>
public sealed class ProductMetricsCalculator : IProductMetricsCalculator
{
    /// <summary>
    /// Порог "давности" публикации замера на eBay, после которого он считается невыставленным.
    /// </summary>
    private const int UnpublishedThresholdDays = 7;

    private readonly IProductQueries _productQueries;
    private readonly IProductRepository _productRepository;
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly ILogger<ProductMetricsCalculator> _logger;

    /// <summary>
    /// Создает сервис пересчета метрик товара.
    /// </summary>
    public ProductMetricsCalculator(
        IProductQueries productQueries,
        IProductRepository productRepository,
        IWriteModelUnitOfWork unitOfWork,
        ILogger<ProductMetricsCalculator> logger)
    {
        _productQueries = productQueries;
        _productRepository = productRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task CalculateAsync(Guid productId, CancellationToken cancellationToken)
    {
        var lotCalculationResults = await _productQueries.GetLotCalculationResultsAsync(productId, cancellationToken);

        var publishedThreshold = DateTimeOffset.UtcNow.AddDays(-UnpublishedThresholdDays);
        var unpublishedOnEbayCountCreated = await _productQueries.GetUnpublishedOnEbayCountAsync(
            productId,
            MeasurementState.Created,
            publishedThreshold,
            cancellationToken);
        var unpublishedOnEbayCountSelling = await _productQueries.GetUnpublishedOnEbayCountAsync(
            productId,
            MeasurementState.Selling,
            publishedThreshold,
            cancellationToken);

        var product = await _productRepository.GetByIdAsync(productId, cancellationToken);
        if (product == null)
        {
            _logger.LogWarning("Product with id {ProductId} not found", productId);
            return;
        }

        product.RecalculateMetrics(lotCalculationResults, unpublishedOnEbayCountCreated, unpublishedOnEbayCountSelling);

        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
