using AwesomeAssertions;
using Microsoft.Extensions.DependencyInjection;
using Server.Application;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;
using Tests.Shared;

namespace Tests.Integration.Tests;

[TestOf(typeof(IProductEmailSendHistoryRepository))]
public class ProductEmailSendHistoryRepositoryTests
{
    private static readonly DateTimeOffset Threshold = new(2024, 10, 18, 12, 0, 0, TimeSpan.Zero);

    [Test]
    public async Task FindAsync_ByDedupKey_ReturnsSavedRecordOnlyForSameMarketplace()
    {
        var productId = await CreateProductAsync();
        var sellerKey = $"seller-{Guid.NewGuid():N}";
        var saved = await SaveAsync(productId, sellerKey, "Qrz", Threshold.AddDays(1));

        await using var unitOfWork = await BeginAsync();
        var repository = GetRepository();

        var found = await repository.FindAsync(unitOfWork, productId, sellerKey, "Qrz", CancellationToken.None);
        var otherMarketplace = await repository.FindAsync(unitOfWork, productId, sellerKey, "Chipfind", CancellationToken.None);

        found.Should().NotBeNull();
        found!.Id.Should().Be(saved.Id);
        found.SellerName.Should().Be("Seller Name");
        otherMarketplace.Should().BeNull();
    }

    [Test]
    [OpenSpecScenario("sale-advertisement-monitoring", "Records expire two years after their latest advertisement date", "Record older than two years is removed")]
    [OpenSpecScenario("sale-advertisement-monitoring", "Records expire two years after their latest advertisement date", "Record within two years is kept")]
    public async Task RemoveOlderThanAsync_CleanupOnOctober18_RemovesRecordOlderThanTwoYearsAndKeepsRecentOne()
    {
        // Порог считается так же, как в SaleAdvertisementCleanupService: момент запуска минус срок хранения.
        var cleanupRunAt = new DateTimeOffset(2026, 10, 18, 12, 0, 0, TimeSpan.Zero);
        var threshold = cleanupRunAt - WellKnown.SaleAdvertisements.RemoveAdvertisementAfter;
        var productId = await CreateProductAsync();
        var stale = await SaveAsync(productId, $"stale-{Guid.NewGuid():N}", "Qrz", new DateTimeOffset(2024, 10, 17, 12, 0, 0, TimeSpan.Zero));
        var fresh = await SaveAsync(productId, $"fresh-{Guid.NewGuid():N}", "Qrz", new DateTimeOffset(2026, 6, 20, 12, 0, 0, TimeSpan.Zero));

        await using (var unitOfWork = await BeginAsync())
        {
            await GetRepository().RemoveOlderThanAsync(unitOfWork, threshold, CancellationToken.None);
        }

        await using var readUnitOfWork = await BeginAsync();
        var repository = GetRepository();
        (await repository.GetByIdAsync(readUnitOfWork, stale.Id, CancellationToken.None)).Should().BeNull();
        (await repository.GetByIdAsync(readUnitOfWork, fresh.Id, CancellationToken.None)).Should().NotBeNull();
    }

    private static async Task<ProductEmailSendHistory> SaveAsync(Guid productId, string sellerKey, string marketplace, DateTimeOffset date)
    {
        var record = ProductEmailSendHistory.Create(
            productId: productId,
            sellerKey: sellerKey,
            sellerName: "Seller Name",
            link: "https://example.com/ad",
            marketplace: marketplace,
            isAmbiguous: false,
            advertisementDate: date,
            contact: null);

        await using var unitOfWork = await BeginAsync();
        await GetRepository().AddAsync(unitOfWork, record, CancellationToken.None);
        await unitOfWork.SaveChangesAsync(CancellationToken.None);

        return record;
    }

    private static async Task<Guid> CreateProductAsync()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        return await TestHelpers.CreateProductAsync(TestHelpers.CreateWebApiClient(httpClient));
    }

    private static Task<IWriteModelUnitOfWork> BeginAsync() =>
        IntegrationTestsSetupFixture.Factory.Services.GetRequiredService<IWriteModelUnitOfWorkFactory>()
            .BeginAsync(CancellationToken.None);

    private static IProductEmailSendHistoryRepository GetRepository() =>
        IntegrationTestsSetupFixture.Factory.Services.GetRequiredService<IProductEmailSendHistoryRepository>();
}
