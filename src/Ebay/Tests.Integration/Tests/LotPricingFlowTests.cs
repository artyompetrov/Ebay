using Tests.Shared;
using Client.Clients.Generated;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using DomainCurrency = Server.Domain.Currency;

namespace Tests.Integration.Tests;

public class LotPricingFlowTests
{
    [Test]
    public async Task UpsertLotInfo_PersistsLotAndPurchases_AndConsumerComputesPricing()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateEbayClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(ebayClient);

        await EnsureCurrencyExistsAsync("KZT");

        var lotId = TestHelpers.NextMeasurementSeed();
        var titleChangeDate = DateTimeOffset.UtcNow.AddDays(-30);
        var purchaseDate = DateTimeOffset.UtcNow.AddDays(-1);

        var lotInfo = new LotInfo
        {
            LotId = lotId,
            Name = "integration-lot",
            Pcs = 1,
            ShippingCountry = "US",
            Currency = "KZT",
            Price = 10000,
            Shipping = 500,
            ShippingAdditional = 100,
            Description = "integration-lot-description",
            Condition = "New",
            Seller = "integration-seller",
            LocatedIn = "US",
            Categories =
            [
                new CategoryValue { Type = "condition", Value = "new" },
                new CategoryValue { Type = "test_state", Value = "notTested" }
            ],
            TitleChangeDate = titleChangeDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
            PurchaseHistory =
            [
                new PurchaseInfo
                {
                    Date = purchaseDate.ToString("yyyy-MM-ddTHH:mm:ss.fffZ"),
                    Price = 10000,
                    Quantity = 1
                }
            ]
        };

        await ebayClient.UpsertLotInfoAsync(lotInfo, productId);

        var lots = await ebayClient.GetLotsAsync(productId);
        var lotShort = lots.SingleOrDefault(x => x.LotId == lotId) ?? throw new AssertionException($"Lot '{lotId}' was not found via GetLotsAsync.");
        Assert.That(lotShort.Name, Is.EqualTo("integration-lot"));

        var lotDetails = await ebayClient.GetLotInfoAsync(lotId);
        using (Assert.EnterMultipleScope())
        {
            Assert.That(lotDetails.ProductId, Is.EqualTo(productId));
            Assert.That(lotDetails.LotInfo.PurchaseHistory, Has.Count.EqualTo(1));
        }

        await TestHelpers.RetryUntilValidationSuccessAsync(async () =>
        {
            var refreshedLot = await ebayClient.GetLotInfoAsync(lotId);
            Assert.That(refreshedLot.LotInfo.PurchaseHistory.Single().PurchaseCalculationResult, Is.Not.Null);
        });
    }

    private static async Task EnsureCurrencyExistsAsync(string currencyEbayName)
    {
        using var scope = IntegrationTestsSetupFixture.Factory.Services.CreateScope();
        var currencyRepository = scope.ServiceProvider.GetRequiredService<ICurrencyRepository>();
        var unitOfWork = scope.ServiceProvider.GetRequiredService<IWriteModelUnitOfWork>();

        var existing = await currencyRepository.GetByIdAsync(currencyEbayName, CancellationToken.None);
        if (existing != null)
        {
            return;
        }

        var currency = DomainCurrency.Create(
            currencyEbayName: currencyEbayName,
            currencyRusName: currencyEbayName,
            currencyApiName: currencyEbayName,
            currencyRate: 1.0,
            lastUpdate: DateTimeOffset.UtcNow);
        await currencyRepository.AddAsync(currency, CancellationToken.None);
        await unitOfWork.SaveChangesAsync(CancellationToken.None);
    }
}
