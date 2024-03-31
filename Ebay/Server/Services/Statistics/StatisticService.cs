using Ebay.Server.Data;
using Ebay.Server.Infrastructure;
using Ebay.Server.Pages.Shared;
using Microsoft.EntityFrameworkCore;

namespace Ebay.Server.Services.Statistics;

internal class StatisticService
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly RazorPartialToStringRenderer _razorPartialToStringRenderer;

    public StatisticService(
        ApplicationDbContext applicationContext,
        RazorPartialToStringRenderer razorPartialToStringRenderer
    )
    {
        _applicationContext = applicationContext;
        _razorPartialToStringRenderer = razorPartialToStringRenderer;
    }

    public Task<string> GenerateStatistics(Guid productId)
    {
        var totalCount = 0;
        var conditionDistribution = new Dictionary<string, int>();

        foreach (var lot in _applicationContext.Lots
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .Include(x => x.Purchases))
        {
            foreach (var lotPurchase in lot.Purchases)
            {
                var conditionCategoryName = lot.Categories[WellKnown.Categories.Conditions.CategoryName];

                var countInPcs = lot.Pcs * lotPurchase.Quantity;

                conditionDistribution[conditionCategoryName] =
                    conditionDistribution.GetOrAdd(key: conditionCategoryName, newValue: 0) + countInPcs;

                totalCount += countInPcs;
            }
        }


        return _razorPartialToStringRenderer.RenderPartialToStringAsync(
            partialName: nameof(_Statistics),
            model: new _Statistics(totalCount: totalCount, conditionDistribution: conditionDistribution)
        );
    }
}