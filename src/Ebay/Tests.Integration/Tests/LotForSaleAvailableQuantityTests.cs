using AwesomeAssertions;
using Client.Clients.Generated;
using Server.Application;
using Tests.Shared;

namespace Tests.Integration.Tests;

[TestOf(typeof(LotForSaleService))]
public class LotForSaleAvailableQuantityTests
{
    private const int UnmatchedMeasurementCount = 3;

    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale available quantity", "A lot without linked measurements has zero available quantity")]
    public async Task GetLotForSales_LotWithoutMeasurements_ReportsZero()
    {
        var context = await CreateContextAsync();
        var lotId = await CreateLotAsync(context);

        (await GetAvailableQuantityAsync(context, lotId)).Should().Be(0);
    }

    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale available quantity", "Unmatched measurements are counted one by one")]
    public async Task GetLotForSales_UnmatchedMeasurements_CountsEachMeasurement()
    {
        var context = await CreateContextAsync();
        var lotId = await CreateLotAsync(context);
        for (var i = 0; i < UnmatchedMeasurementCount; i++)
        {
            await UploadMeasurementAsync(context, lotId, matchId: null, MeasurementState.Selling);
        }

        (await GetAvailableQuantityAsync(context, lotId)).Should().Be(UnmatchedMeasurementCount);
    }

    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale available quantity", "A matched set is counted as one unit")]
    public async Task GetLotForSales_MatchedPairs_CountsEachSetOnce()
    {
        var context = await CreateContextAsync();
        var lotId = await CreateLotAsync(context);
        await UploadMatchedPairAsync(context, lotId, MeasurementState.Selling);
        await UploadMatchedPairAsync(context, lotId, MeasurementState.Selling);
        await UploadMeasurementAsync(context, lotId, matchId: null, MeasurementState.Selling);

        (await GetAvailableQuantityAsync(context, lotId)).Should().Be(3);
    }

    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale available quantity", "Sold measurements are not counted")]
    public async Task GetLotForSales_SoldPair_IsNotCounted()
    {
        var context = await CreateContextAsync();
        var lotId = await CreateLotAsync(context);
        await UploadMatchedPairAsync(context, lotId, MeasurementState.Selling);
        await UploadMatchedPairAsync(context, lotId, MeasurementState.Sold);

        (await GetAvailableQuantityAsync(context, lotId)).Should().Be(1);
    }

    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale available quantity", "Measurements in Created and Selling states are both counted")]
    public async Task GetLotForSales_CreatedAndSellingMeasurements_AreBothCounted()
    {
        var context = await CreateContextAsync();
        var lotId = await CreateLotAsync(context);
        await UploadMeasurementAsync(context, lotId, matchId: null, MeasurementState.Created);
        await UploadMeasurementAsync(context, lotId, matchId: null, MeasurementState.Selling);

        (await GetAvailableQuantityAsync(context, lotId)).Should().Be(2);
    }

    [Test]
    [OpenSpecScenario("lot-for-sale-listing", "Lot-for-sale available quantity", "Measurements of another lot are not counted")]
    public async Task GetLotForSales_MeasurementsOfAnotherLot_AreNotCounted()
    {
        var context = await CreateContextAsync();
        var firstLotId = await CreateLotAsync(context);
        var secondLotId = await CreateLotAsync(context);
        await UploadMeasurementAsync(context, firstLotId, matchId: null, MeasurementState.Selling);
        await UploadMeasurementAsync(context, firstLotId, matchId: null, MeasurementState.Selling);

        var lots = await context.Client.GetLotForSalesAsync();

        lots.Single(x => x.Id == firstLotId).AvailableQuantity.Should().Be(2);
        lots.Single(x => x.Id == secondLotId).AvailableQuantity.Should().Be(0);
    }

    [Test]
    public async Task GetLotForSales_ReadsLotsWithQuantitiesInSingleQuery()
    {
        var context = await CreateContextAsync();
        var lotId = await CreateLotAsync(context);
        await UploadMatchedPairAsync(context, lotId, MeasurementState.Selling);
        await CreateLotAsync(context);

        using var counterScope = IntegrationTestsSetupFixture.DatabaseCommandCounter.BeginScope("LotForSales", "ProductMeasurements");
        await context.Client.GetLotForSalesAsync();

        // Количество считается подзапросом в той же SQL-команде, а не загрузкой замеров в память.
        counterScope.Commands.Should().ContainSingle().Which.Should().ContainEquivalentOf("count(");
    }

    private static async Task<LotTestContext> CreateContextAsync()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var client = TestHelpers.CreateWebApiClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(client);
        return new LotTestContext(client, productId);
    }

    private static async Task<string> CreateLotAsync(LotTestContext context)
    {
        var lotIdsBefore = await GetLotIdsOfProductAsync(context);

        await context.Client.CreateLotForSaleAsync(new LotForSaleCreateRequest
        {
            Name = "Test lot",
            ProductId = context.ProductId,
            ProductState = LotForSaleProductState.New,
            MeasurementState = LotForSaleMeasurementState.Selling
        });

        var lotIdsAfter = await GetLotIdsOfProductAsync(context);
        return lotIdsAfter.Except(lotIdsBefore).Single();
    }

    private static async Task<string[]> GetLotIdsOfProductAsync(LotTestContext context)
    {
        var lots = await context.Client.GetLotForSalesAsync();
        return lots.Where(x => x.ProductId == context.ProductId).Select(x => x.Id).ToArray();
    }

    private static async Task<int> GetAvailableQuantityAsync(LotTestContext context, string lotId)
    {
        var lots = await context.Client.GetLotForSalesAsync();
        return lots.Single(x => x.Id == lotId).AvailableQuantity;
    }

    private static async Task UploadMatchedPairAsync(LotTestContext context, string lotId, MeasurementState state)
    {
        var matchId = $"MATCH{TestHelpers.NextMeasurementSeed()}";
        await UploadMeasurementAsync(context, lotId, matchId, state);
        await UploadMeasurementAsync(context, lotId, matchId, state);
    }

    private static async Task UploadMeasurementAsync(LotTestContext context, string lotId, string? matchId, MeasurementState state)
    {
        var seed = TestHelpers.NextMeasurementSeed();
        var measurementId = $"MEA{seed}";
        await context.Client.UploadMeasurementAsync(
            new MeasurementDataToUpload
            {
                MeasurementId = measurementId,
                ManufactureCode = "2026-02",
                ProductState = ProductState.New,
                File = TestHelpers.CreateValidMeasurementArchive(seed)
            },
            context.ProductId);

        await context.Client.UpdateMeasurementLotIdAsync(lotId, context.ProductId, measurementId);
        if (matchId is not null)
        {
            await context.Client.UpdateMeasurementMatchIdAsync(matchId, context.ProductId, measurementId);
        }

        if (state != MeasurementState.Created)
        {
            await context.Client.UpdateMeasurementStateAsync(state, context.ProductId, measurementId);
        }
    }

    private sealed record LotTestContext(WebApiClient Client, Guid ProductId);
}
