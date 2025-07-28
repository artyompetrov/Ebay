using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Application.Data;
using Server.Application.Data.Models;

namespace Server.Application.Consumers;

public class CalculateTotalAveragePriceForProductConsumer : IConsumer<Batch<CalculateTotalAveragePriceForProduct>>
{
    private readonly ApplicationDbContext _applicationDbContext;

    public CalculateTotalAveragePriceForProductConsumer(ApplicationDbContext applicationDbContext)
    {
        _applicationDbContext = applicationDbContext;
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
            var quantityTotal = 0;

            var dateTime = DateTime.UtcNow;
            foreach (var lotCalculationResult in lotCalculationResults)
            {
                if (lotCalculationResult == null) throw new NullReferenceException(nameof(lotCalculationResults));
                revenue += lotCalculationResult.Revenue;
                quantityTotal += lotCalculationResult.QuantityTotal;

                if (dateTime > lotCalculationResult.CalculationDate)
                {
                    dateTime = lotCalculationResult.CalculationDate;
                }
            }

            var dbProduct = _applicationDbContext.Products.Attach(new Product { Id = productId });
            dbProduct.Entity.ProductCalculationResult = new ProductCalculationResult
            {
                Revenue = revenue,
                QuantityTotal = quantityTotal,
                CalculationDate = dateTime
            };

            await _applicationDbContext.SaveChangesAsync(context.CancellationToken);
        }
    }
}

public record CalculateTotalAveragePriceForProduct(Guid ProductId);