using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Repositories;
using Server.Application.Data;
using Server.Domain;

namespace Server.Application.Consumers.PriceCalculator
{
    internal class CalculateTotalAveragePriceForProductConsumer(
        ApplicationDbContext applicationDbContext,
        IProductRepository productRepository,
        IUnitOfWork unitOfWork,
        ILogger<CalculateTotalAveragePriceForProductConsumer> logger) : IConsumer<Batch<CalculateTotalAveragePriceForProduct>>
    {
        private readonly ApplicationDbContext _applicationDbContext = applicationDbContext;
        private readonly IProductRepository _productRepository = productRepository;
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
        private readonly ILogger<CalculateTotalAveragePriceForProductConsumer> _logger = logger;

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
                    if (lotCalculationResult == null)
                    {
                        throw new InvalidOperationException(nameof(lotCalculationResults));
                    }

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
                    ListingPriceSumm = listingPrice
                };

                _ = await _unitOfWork.SaveChangesAsync(context.CancellationToken);

                _ = await _applicationDbContext.SaveChangesAsync(context.CancellationToken);
            }
        }
    }

    public record CalculateTotalAveragePriceForProduct(Guid ProductId);
}