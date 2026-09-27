using Tests.Shared;
using System.Net;
using Client.Clients.Generated;

namespace Tests.Integration.Tests;

public class ProductPassportFlowTests
{
    private static readonly int[] ExpectedInitialOrders = [0, 1, 2];

    [Test]
    public async Task UploadDeleteAndReorderProductPassports_KeepsOrderContiguous()
    {
        var httpClient = IntegrationTestsSetupFixture.Factory.CreateClient();
        await TestHelpers.AuthenticateWithClientCredentialsAsync(httpClient);
        var ebayClient = TestHelpers.CreateWebApiClient(httpClient);
        var productId = await TestHelpers.CreateProductAsync(ebayClient);

        // Uploading three passports without an explicit Order appends them in upload order (0, 1, 2).
        await ebayClient.UploadProductPassportAsync(new ProductPassportUpload
        {
            FileName = "passport-0.pdf",
            ContentType = "application/pdf",
            File = [1]
        }, productId);
        await ebayClient.UploadProductPassportAsync(new ProductPassportUpload
        {
            FileName = "passport-1.pdf",
            ContentType = "application/pdf",
            File = [2]
        }, productId);
        await ebayClient.UploadProductPassportAsync(new ProductPassportUpload
        {
            FileName = "passport-2.pdf",
            ContentType = "application/pdf",
            File = [3]
        }, productId);

        var passports = await ebayClient.GetProductPassportsAsync(productId);
        Assert.That(passports.Select(x => x.Order).OrderBy(x => x), Is.EqualTo(ExpectedInitialOrders));

        var middlePassportId = passports.Single(x => x.Order == 1).Id;
        var lastPassportId = passports.Single(x => x.Order == 2).Id;

        // Deleting the middle passport (order 1) must shift the last one (order 2) down to order 1,
        // exercising ProductPassportService.DeleteAsync's order-decrement-shift logic.
        await ebayClient.DeleteProductPassportAsync(productId, middlePassportId);

        var afterDelete = await ebayClient.GetProductPassportsAsync(productId);
        Assert.That(afterDelete, Has.Count.EqualTo(2));
        Assert.That(afterDelete.Single(x => x.Id == lastPassportId).Order, Is.EqualTo(1));

        var firstPassportId = afterDelete.Single(x => x.Order == 0).Id;

        // Moving the first passport (order 0) to order 1 must shift the other one (order 1) down to order 0,
        // exercising ProductPassportService.UpdateOrderAsync's shift-range logic.
        await ebayClient.UpdateProductPassportAsync(new ProductPassportUpdate { Order = 1 }, productId, firstPassportId);

        var afterReorder = await ebayClient.GetProductPassportsAsync(productId);
        using (Assert.EnterMultipleScope())
        {
            Assert.That(afterReorder.Single(x => x.Id == firstPassportId).Order, Is.EqualTo(1));
            Assert.That(afterReorder.Single(x => x.Id == lastPassportId).Order, Is.Zero);
        }

        // Deleting/updating an unknown passport id returns 400 (NonOkHttpAnswerException.NotFound400).
        var deleteException = Assert.CatchAsync<ApiException>(() =>
            ebayClient.DeleteProductPassportAsync(productId, Guid.NewGuid()));
        Assert.That(deleteException!.StatusCode, Is.EqualTo((int)HttpStatusCode.BadRequest));

        var updateException = Assert.CatchAsync<ApiException>(() =>
            ebayClient.UpdateProductPassportAsync(new ProductPassportUpdate { Order = 0 }, productId, Guid.NewGuid()));
        Assert.That(updateException!.StatusCode, Is.EqualTo((int)HttpStatusCode.BadRequest));
    }
}
