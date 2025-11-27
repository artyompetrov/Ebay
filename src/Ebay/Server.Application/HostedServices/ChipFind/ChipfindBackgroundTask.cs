using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Queries;
using Server.Application.Data;
using Server.Application.Infrastructure;
using Server.Domain;

namespace Server.Application.HostedServices.ChipFind;

public class ChipfindBackgroundTask(
    ILogger<ChipfindBackgroundTask> logger,
    EbayServerOptions ebayServerOptions,
    IServiceScopeFactory serviceScopeFactory
    ) : BackgroundTask(logger)
{
    private readonly ILogger<ChipfindBackgroundTask> _logger = logger;
    private readonly EbayServerOptions _ebayServerOptions = ebayServerOptions;
    private readonly IServiceScopeFactory _serviceScopeFactory = serviceScopeFactory;
    private const int DelayMilliseconds = 5000;

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    private record ProductInner(Guid ProductId, Regex Regex, bool IsInteresting);

    protected override async Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_ebayServerOptions.IsLocalRun)
        {
            return;
        }

        using var scope = _serviceScopeFactory.CreateScope();
        var applicationDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        var chipfindAdapter = scope.ServiceProvider.GetRequiredService<IChipfindAdapter>();
        var emailSender = scope.ServiceProvider.GetRequiredService<IEmailSender>();
        var productQueries = scope.ServiceProvider.GetRequiredService<IProductQueries>();

        var products = await GetProducts(
            cancellationToken: cancellationToken,
            productQueries: productQueries);

        var recentAdvertisements = await chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);

        foreach (var saleAdvertisement in recentAdvertisements)
        {
            await ProcessAdvertisement(
                emailSender: emailSender,
                chipfindAdapter: chipfindAdapter,
                cancellationToken: cancellationToken,
                saleAdvertisement: saleAdvertisement,
                products: products,
                applicationDbContext: applicationDbContext);
        }
    }

    private async Task ProcessAdvertisement(
        IEmailSender emailSender,
        IChipfindAdapter chipfindAdapter,
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<ProductInner> products,
        ApplicationDbContext applicationDbContext,
        CancellationToken cancellationToken)
    {
        using var transaction = TransactionScopeFactory.Create();

        var newInterestingAds = new HashSet<(bool IsAmbiguous, string Ad, string? Contact)>();
        string? advertisementContact = null;

        foreach (var saleAdvertisementItem in saleAdvertisement.Items)
        {
            var matchesWithProducts = products
                .Where(x => x.Regex.IsMatch(saleAdvertisementItem))
                .ToList();

            if (matchesWithProducts.Count == 0)
            {
                continue;
            }

            advertisementContact = await chipfindAdapter.TryGetAdvertisementContactAsync(
                saleAdvertisement,
                cancellationToken);

            var isAmbiguous = matchesWithProducts.Count > 1;

            foreach (var product in matchesWithProducts)
            {
                var record = applicationDbContext.ProductEmailSendHistory
                    .Local
                    .FirstOrDefault(
                        e =>
                            e.ProductId == product.ProductId &&
                            e.Seller == saleAdvertisement.Seller &&
                            e.Marketplace == WellKnown.ChipFind.Marketplace)
                    ?? await applicationDbContext.ProductEmailSendHistory
                        .FirstOrDefaultAsync(
                            e =>
                                e.ProductId == product.ProductId &&
                                e.Seller == saleAdvertisement.Seller &&
                                e.Marketplace == WellKnown.ChipFind.Marketplace,
                            cancellationToken);

                if (record is null)
                {
                    var newRecord = new ProductEmailSendHistory
                    {
                        ProductId = product.ProductId,
                        Seller = saleAdvertisement.Seller,
                        Link = saleAdvertisement.Link.ToString(),
                        CreatedAt = saleAdvertisement.Date,
                        Marketplace = WellKnown.ChipFind.Marketplace,
                        IsAmbiguous = isAmbiguous
                    };

                    //todo по идее эту проверку надо делать через инвариант агрегата
                    if (!string.IsNullOrWhiteSpace(advertisementContact))
                    {
                        newRecord.Contact = advertisementContact;
                    }

                    _ = applicationDbContext.ProductEmailSendHistory.Add(newRecord);

                    if (product.IsInteresting)
                    {
                        _ = newInterestingAds.Add((IsAmbiguous: isAmbiguous, Ad: saleAdvertisementItem, Contact: advertisementContact));
                    }
                }
                else
                {
                    record.Link = saleAdvertisement.Link.ToString();
                    record.CreatedAt = saleAdvertisement.Date;
                    record.IsAmbiguous = isAmbiguous;
                    if (!string.IsNullOrWhiteSpace(advertisementContact))
                    {
                        record.Contact = advertisementContact;
                    }
                }
            }
        }

        _ = await applicationDbContext.SaveChangesAsync(cancellationToken);

        if (newInterestingAds.Count > 0)
        {
            var newItems = string.Join(" ",
                values: newInterestingAds.Select(x =>
                    x.Ad + (x.IsAmbiguous ? " [Нашлось несколько товаров] " : "")
                    ).Select(x => $"<div>{x}</div>")
                );
            var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a><br><br>{newItems}<br><div>{advertisementContact}</div>";
            var emailTopic = $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]";
            _logger.LogInformation("Email sent {EmailTopic}", emailTopic);
            _logger.LogDebug("Email sent {EmailBody}", emailBody);
            await emailSender.Send(
                targetAddress: _ebayServerOptions.TargetEmail,
                topic: emailTopic,
                messageText: emailBody);

            await Task.Delay(millisecondsDelay: DelayMilliseconds, cancellationToken: cancellationToken);
        }

        transaction.Complete();
    }

    private static async Task<IReadOnlyCollection<ProductInner>> GetProducts(
        IProductQueries productQueries,
        CancellationToken cancellationToken)
    {
        var products = await productQueries.GetAllProductsAsync(cancellationToken);

        var productsArray = products.Select(x => new ProductInner(
                ProductId: x.Id,
                Regex: x.ProductRegex,
                IsInteresting: x.GetIsInteresting()))
            .ToArray();

        return productsArray;
    }
}
