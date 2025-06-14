namespace Tests;

[Category("ExplicitOnly")]
[Explicit]
[NonParallelizable]
public class MeasurementPageTest : ExplicitTestsBase
{
    private static IEnumerable<TestCaseData> GetMeasurements()
    {
        var allProducts = BackendClient.GetAllProductsAsync().GetAwaiter().GetResult();

        foreach (var productWithId in allProducts)
        {
            var measurements = BackendClient.GetMeasurementsAsync(productWithId.Id).GetAwaiter().GetResult();

            foreach (var measurement in measurements)
            {
                yield return new TestCaseData(measurement.MeasurementId)
                {
                    TestName = $"{measurement.MeasurementId}"
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