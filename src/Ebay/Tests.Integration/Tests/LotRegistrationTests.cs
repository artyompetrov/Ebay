using System.Globalization;
using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Nodes;
using AwesomeAssertions;
using Client.Clients.Generated;
using Server.Application;
using Tests.Shared;

namespace Tests.Integration.Tests;

[TestOf(typeof(LotService))]
public class LotRegistrationTests
{
    private const string Currency = "KZT";
    private const string DateFormat = "yyyy-MM-ddTHH:mm:ss.fffZ";
    private const string AdditionalPropertiesField = "additionalProperties";
    private const string LotName = "integration-lot";
    private const string RenamedLotName = "integration-lot-renamed";
    private const int PcsPerLot = 1;
    private const int LotSize = 2;
    private const double LotPrice = 10000;
    private const double RaisedLotPrice = 20000;
    private const double Shipping = 500;
    private const double ShippingAdditional = 100;
    private const int SaleQuantity = 1;

    private static readonly DateTimeOffset TitleChangeDate = new(2026, 5, 1, 0, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset SaleBeforeTitleChange = new(2026, 4, 30, 0, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset SaleAfterTitleChange = new(2026, 5, 2, 0, 0, 0, TimeSpan.Zero);

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Registering a lot stores its current listing", "New lot is registered")]
    public async Task UpsertLotInfo_NewLot_IsReturnedWithSubmittedListing()
    {
        var context = await CreateContextAsync();
        var lotInfo = CreateLotInfo(context.LotId, TitleChangeDate, []);

        await context.Client.UpsertLotInfoAsync(lotInfo, context.ProductId);

        var stored = await context.Client.GetLotInfoAsync(context.LotId);
        stored.ProductId.Should().Be(context.ProductId);
        stored.LotInfo.Should().BeEquivalentTo(lotInfo, static options => options.Excluding(x => x.TitleChangeDate));
        ParseDate(stored.LotInfo.TitleChangeDate).Should().Be(TitleChangeDate);
    }

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Registering a lot stores its current listing", "Stored lot is registered again")]
    public async Task UpsertLotInfo_StoredLot_ReplacesListing()
    {
        var context = await CreateContextAsync();
        await context.Client.UpsertLotInfoAsync(CreateLotInfo(context.LotId, TitleChangeDate, []), context.ProductId);
        var updated = CreateLotInfo(context.LotId, TitleChangeDate, []);
        updated.Name = RenamedLotName;
        updated.Price = RaisedLotPrice;

        await context.Client.UpsertLotInfoAsync(updated, context.ProductId);

        var stored = await context.Client.GetLotInfoAsync(context.LotId);
        stored.LotInfo.Name.Should().Be(RenamedLotName);
        stored.LotInfo.Price.Should().Be(RaisedLotPrice);
    }

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Registering a lot stores its current listing", "Ignored lot is registered")]
    public async Task UpsertLotInfo_IgnoredLot_IsNoLongerIgnored()
    {
        var context = await CreateContextAsync();
        await context.Client.IgnoreLotsAsync([context.LotId], context.ProductId);

        await context.Client.UpsertLotInfoAsync(CreateLotInfo(context.LotId, TitleChangeDate, []), context.ProductId);

        (await context.Client.GetIgnoredLotsAsync(context.ProductId)).Should().NotContain(context.LotId);
    }

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Registering a lot stores its current listing", "Extension sends fields outside the contract")]
    public async Task UpsertLotInfo_FieldsOutsideContract_AreIgnored()
    {
        var context = await CreateContextAsync();
        // Так лот отправляли версии расширения до добавления additionalProperties: false в схему лота.
        // SerializeToNode возвращает null только для null-значения, а сериализуется созданный объект.
        var body = JsonSerializer.SerializeToNode(CreateLotInfo(context.LotId, TitleChangeDate, []))!.AsObject();
        body["pcs"] = PcsPerLot.ToString(CultureInfo.InvariantCulture);
        body["productId"] = context.ProductId.ToString();
        body["autoPcs"] = PcsPerLot.ToString(CultureInfo.InvariantCulture);
        body[AdditionalPropertiesField] = new JsonObject();

        using var response = await context.HttpClient.PostAsJsonAsync($"api/ebay/v1/products/{context.ProductId}/lots/", body);

        response.EnsureSuccessStatusCode();
        (await context.Client.GetLotInfoAsync(context.LotId)).LotInfo.Pcs.Should().Be(PcsPerLot);
    }

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Sales before the title change are not stored", "Sales before the title change are dropped")]
    public async Task UpsertLotInfo_SalesBeforeTitleChange_AreNotStored()
    {
        var context = await CreateContextAsync();
        var lotInfo = CreateLotInfo(context.LotId, TitleChangeDate, [SaleBeforeTitleChange, SaleAfterTitleChange]);

        await context.Client.UpsertLotInfoAsync(lotInfo, context.ProductId);

        (await GetStoredSaleDatesAsync(context)).Should().Equal(SaleAfterTitleChange);
    }

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Sales before the title change are not stored", "Title changed since the last registration")]
    public async Task UpsertLotInfo_TitleChangedSinceLastRegistration_RemovesEarlierStoredSales()
    {
        var context = await CreateContextAsync();
        var neverRenamed = DateTimeOffset.UnixEpoch;
        await context.Client.UpsertLotInfoAsync(
            CreateLotInfo(context.LotId, neverRenamed, [SaleBeforeTitleChange, SaleAfterTitleChange]),
            context.ProductId);

        await context.Client.UpsertLotInfoAsync(CreateLotInfo(context.LotId, TitleChangeDate, []), context.ProductId);

        (await GetStoredSaleDatesAsync(context)).Should().Equal(SaleAfterTitleChange);
    }

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Sales before the title change are not stored", "Sale at the title change moment")]
    public async Task UpsertLotInfo_SaleAtTitleChangeMoment_IsStoredAsRecent()
    {
        var context = await CreateContextAsync();

        await context.Client.UpsertLotInfoAsync(CreateLotInfo(context.LotId, TitleChangeDate, [TitleChangeDate]), context.ProductId);

        var sale = (await context.Client.GetLotInfoAsync(context.LotId)).LotInfo.PurchaseHistory.Should().ContainSingle().Subject;
        ParseDate(sale.Date).Should().Be(TitleChangeDate);
        sale.IsRecent.Should().BeTrue();
    }

    [Test]
    [OpenSpecScenario("ebay-lot-registration", "Stored lot is returned with documented fields only", "Reading a registered lot")]
    public async Task GetLotInfo_RegisteredLot_HasNoAdditionalPropertiesField()
    {
        var context = await CreateContextAsync();
        await context.Client.UpsertLotInfoAsync(CreateLotInfo(context.LotId, TitleChangeDate, [SaleAfterTitleChange]), context.ProductId);

        var json = await context.HttpClient.GetStringAsync($"api/ebay/v1/lots/{context.LotId}/");

        using var document = JsonDocument.Parse(json);
        var lotInfo = document.RootElement.GetProperty("lotInfo");
        lotInfo.GetProperty("purchaseHistory").GetArrayLength().Should().Be(1);
        lotInfo.GetProperty("categories").GetArrayLength().Should().BePositive();
        FindPropertyNames(document.RootElement).Should().NotContain(AdditionalPropertiesField);
    }

    [Test]
    public async Task UpsertLotInfo_ShippingNotSet_AnswersMessagesPerField()
    {
        var context = await CreateContextAsync();
        var lotInfo = CreateLotInfo(context.LotId, TitleChangeDate, []);
        lotInfo.Shipping = null;

        var exception = await FluentActions
            .Awaiting(() => context.Client.UpsertLotInfoAsync(lotInfo, context.ProductId))
            .Should().ThrowAsync<ApiException<ValidationProblemDetailedInfo>>();

        var errors = exception.Which.Result.Errors.AdditionalProperties;
        errors.Keys.Should().Equal(nameof(LotInfo.Shipping));
        var messages = errors[nameof(LotInfo.Shipping)].Should().BeOfType<JsonElement>().Subject;
        messages.ValueKind.Should().Be(JsonValueKind.Array);
        messages.GetArrayLength().Should().BePositive();
    }

    private static IEnumerable<string> FindPropertyNames(JsonElement element) => element.ValueKind switch
    {
        JsonValueKind.Object => element.EnumerateObject().SelectMany(static x => FindPropertyNames(x.Value).Prepend(x.Name)),
        JsonValueKind.Array => element.EnumerateArray().SelectMany(FindPropertyNames),
        _ => []
    };

    private static DateTimeOffset ParseDate(string value) => DateTimeOffset.Parse(value, CultureInfo.InvariantCulture);

    private static async Task<DateTimeOffset[]> GetStoredSaleDatesAsync(LotRegistrationContext context)
    {
        var stored = await context.Client.GetLotInfoAsync(context.LotId);
        return [.. stored.LotInfo.PurchaseHistory.Select(static x => ParseDate(x.Date))];
    }

    private static async Task<LotRegistrationContext> CreateContextAsync()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var client = TestHelpers.CreateWebApiClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(client);
        await TestHelpers.EnsureCurrencyExistsAsync(Currency);

        return new LotRegistrationContext(httpClient, client, productId, TestHelpers.NextMeasurementSeed());
    }

    private static LotInfo CreateLotInfo(long lotId, DateTimeOffset titleChangeDate, IEnumerable<DateTimeOffset> saleDates) => new()
    {
        LotId = lotId,
        Name = LotName,
        Pcs = PcsPerLot,
        LotSize = LotSize,
        ShippingCountry = "DE",
        Currency = Currency,
        Price = LotPrice,
        Shipping = Shipping,
        ShippingAdditional = ShippingAdditional,
        Description = "integration-lot-description",
        ShortDescription = "integration-lot-short-description",
        Condition = "New",
        ConditionDescription = "integration-lot-condition-description",
        Seller = "integration-seller",
        LocatedIn = "AL",
        Categories =
        [
            new CategoryValue { Type = "condition", Value = "new" },
            new CategoryValue { Type = "test_state", Value = "notTested" }
        ],
        TitleChangeDate = titleChangeDate.ToString(DateFormat, CultureInfo.InvariantCulture),
        PurchaseHistory = [.. saleDates.Select(static date => new PurchaseInfo { Date = date.ToString(DateFormat, CultureInfo.InvariantCulture), Price = LotPrice, Quantity = SaleQuantity })]
    };

    private sealed record LotRegistrationContext(HttpClient HttpClient, WebApiClient Client, Guid ProductId, long LotId);
}
