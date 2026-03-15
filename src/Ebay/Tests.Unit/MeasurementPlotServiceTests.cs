using NUnit.Framework;
using Server.Application.Services.MeasurementPlot;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(MeasurementPlotService))]
public class MeasurementPlotServiceTests
{
    [TestCase(null, "localhost", true)]
    [TestCase("", "localhost", true)]
    [TestCase("https://localhost/ebay_description/1", "localhost", false)]
    [TestCase("https://LOCALHOST/ebay_description/1", "localhost", false)]
    [TestCase("https://www.ebay.com/itm/1", "localhost", true)]
    [TestCase("not-a-url", "localhost", true)]
    public void ShouldTrackEbayView_ReturnsExpectedValue(string? referer, string currentHost, bool expected)
    {
        var result = MeasurementPlotService.ShouldTrackEbayView(referer, currentHost);

        Assert.That(result, Is.EqualTo(expected));
    }
}
