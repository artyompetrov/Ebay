using Ebay.Server.Data;
using Ebay.Server.Infrastructure;
using Ebay.Server.Pages.Shared;
using Microsoft.EntityFrameworkCore;
using Plotly.NET;
using Plotly.NET.LayoutObjects;

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
     
        double[] x = { 1, 2 };
        double[] y = { 5, 10 };

        LinearAxis xAxis = new LinearAxis();
        xAxis.SetValue("title", "xAxis");
        xAxis.SetValue("showgrid", false);
        xAxis.SetValue("showline", true);

        LinearAxis yAxis = new LinearAxis();
        yAxis.SetValue("title", "yAxis");
        yAxis.SetValue("showgrid", false);
        yAxis.SetValue("showline", true);

        Layout layout = new Layout();
        layout.SetValue("xaxis", xAxis);
        layout.SetValue("yaxis", yAxis);
        layout.SetValue("showlegend", true);

        Trace trace = new Trace("scatter");
        trace.SetValue("x", x);
        trace.SetValue("y", y);
        trace.SetValue("mode", "markers");
        trace.SetValue("name", "Hello from C#");

        var xx = GenericChart
            .ofTraceObject(true, trace)
            .WithLayout(layout);

        GenericChart.toJson(xx);

        
        return _razorPartialToStringRenderer.RenderPartialToStringAsync(
            partialName: nameof(_Statistics),
            model: new _Statistics(totalCount: totalCount, conditionDistribution: conditionDistribution, graph: GenericChart.toChartHTML(xx))
        );
    }
}