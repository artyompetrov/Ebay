using Ebay.Server.Areas.Identity.Pages.Shared;
using Ebay.Server.Infrastructure;

namespace Ebay.Server.Services.Statistics;

internal class StatisticService
{
    private readonly RazorPartialToStringRenderer _razorPartialToStringRenderer;

    public StatisticService(RazorPartialToStringRenderer razorPartialToStringRenderer)
    {
        _razorPartialToStringRenderer = razorPartialToStringRenderer;
    }

    public Task<string> GenerateStatistics()
    {
        return _razorPartialToStringRenderer.RenderPartialToStringAsync("_Tested", new _Tested() { V = "blabla"});
    }
}