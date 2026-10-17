namespace Tests.Integration.Tests;

public class IgnoredLotFlowTests
{
    [Test]
    public async Task IgnoreLotsAsync_MarksLotsAsIgnored_AndUpsertLotInfoClearsIt()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateWebApiClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(ebayClient);

        var lotId = TestHelpers.NextMeasurementSeed();

        var isIgnoredBefore = await ebayClient.GetIsLotIgnoredForProductAsync(productId, lotId);
        Assert.That(isIgnoredBefore, Is.False);

        await ebayClient.IgnoreLotsAsync([lotId], productId);

        var isIgnoredAfter = await ebayClient.GetIsLotIgnoredForProductAsync(productId, lotId);
        Assert.That(isIgnoredAfter, Is.True);

        var ignoredLots = await ebayClient.GetIgnoredLotsAsync(productId);
        Assert.That(ignoredLots, Does.Contain(lotId));

        // Calling IgnoreLotsAsync again for the same lot should not fail (insert-missing, not a duplicate insert).
        await ebayClient.IgnoreLotsAsync([lotId], productId);
        var ignoredLotsAfterRepeat = await ebayClient.GetIgnoredLotsAsync(productId);
        Assert.That(ignoredLotsAfterRepeat.Count(x => x == lotId), Is.EqualTo(1));
    }

    [Test]
    public async Task IgnoreLotsAsync_ConcurrentRequestsForSameLots_AllSucceedAndStoreEachLotOnce()
    {
        const int concurrentRequests = 8;
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateWebApiClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(ebayClient);
        long[] lotIds = [TestHelpers.NextMeasurementSeed(), TestHelpers.NextMeasurementSeed()];

        await Task.WhenAll(Enumerable.Range(0, concurrentRequests)
            .Select(_ => ebayClient.IgnoreLotsAsync(lotIds, productId)));

        var ignoredLots = await ebayClient.GetIgnoredLotsAsync(productId);
        Assert.That(ignoredLots.Where(lotIds.Contains), Is.EquivalentTo(lotIds));
    }
}
