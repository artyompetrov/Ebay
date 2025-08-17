using Client.Clients.Generated;

namespace Tests;

[Category("ExplicitOnly")]
[Explicit]
[NonParallelizable]
public class MeasurementPageTest : ExplicitTestsBase
{
    private static IEnumerable<TestCaseData> GetMeasurements()
    {
        var allProducts = new List<ProductWithId>();
        var page = 1;
        const int pageSize = 100;
        while (true)
        {
            var productsPage = BackendClient.GetAllProductsAsync(page, pageSize).GetAwaiter().GetResult();
            if (productsPage.Count == 0)
                break;

            allProducts.AddRange(productsPage);
            page++;
        }

        foreach (var productWithId in allProducts)
        {
            var measurements = BackendClient.GetMeasurementsAsync(null, productWithId.Id).GetAwaiter().GetResult();

            foreach (var measurement in measurements)
            {
                yield return new TestCaseData(measurement.MeasurementId)
                {
                    TestName = $"{productWithId.Name} {measurement.MeasurementId}"
                };
            }
        }
    }

    [TestCaseSource(nameof(GetMeasurements))]
    public async Task Check_Extractor_Function_TestState(string measurementId)
    {
        var response = await HttpClient.GetAsync($"https://{Server}/m/{measurementId}");
        Assert.That(response.StatusCode == System.Net.HttpStatusCode.OK);

        response = await HttpClient.GetAsync($"https://{Server}/m/{measurementId}/curves");
        Assert.That(response.StatusCode == System.Net.HttpStatusCode.OK);
    }
}