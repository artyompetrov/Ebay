using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Application.Infrastructure;

namespace Server.Application.HostedServices.ChipFind;

public class ChipfindBackgroundTask : BackgroundTask
{
    private readonly ILogger<ChipfindBackgroundTask> _logger;
    private readonly IChipfindAdapter _chipfindAdapter;
    private readonly IEmailSender _emailSender;
    private readonly EbayServerOptions _ebayServerOptions;
    private readonly IServiceScopeFactory _serviceScopeFactory;
    private const int DelayAfterSendMilliseconds = 5000;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        IChipfindAdapter chipfindAdapter,
        IEmailSender emailSender,
        EbayServerOptions ebayServerOptions,
        IServiceScopeFactory serviceScopeFactory
    ) : base(logger)
    {
        _logger = logger;
        _chipfindAdapter = chipfindAdapter;
        _emailSender = emailSender;
        _ebayServerOptions = ebayServerOptions;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    private record ProductIdWithRegex(Guid ProductId, Regex Regex);

    protected async override Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_ebayServerOptions.IsLocalRun) return;

        using var scope = _serviceScopeFactory.CreateScope();
        var applicationDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var products = await GetInterestingProductIdsWithRegexes(
            cancellationToken: cancellationToken,
            applicationDbContext: applicationDbContext);

        var recentAdvertisements = await _chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);

        foreach (var saleAdvertisement in recentAdvertisements)
        {
            await ProcessAdvertisement(
                cancellationToken: cancellationToken,
                saleAdvertisement: saleAdvertisement,
                products: products,
                applicationDbContext: applicationDbContext);
        }

        await RemoveStaleAdvertisements(applicationDbContext, cancellationToken);
    }

    private async Task ProcessAdvertisement(
        CancellationToken cancellationToken,
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<ProductIdWithRegex> products,
        ApplicationDbContext applicationDbContext)
    {
        using var transaction = TransactionScopeFactory.Create();

        var newAds = new HashSet<string>();
        foreach (var saleAdvertisementItem in saleAdvertisement.Items)
        {
            var matchesWithProducts = products
                .Where(x => x.Regex.IsMatch(saleAdvertisementItem))
                .ToList();

            foreach (var product in matchesWithProducts)
            {
                var record = await applicationDbContext.ProductEmailSendHistory
                    .FirstOrDefaultAsync(
                        e =>
                            e.ProductId == product.ProductId &&
                            e.Seller == saleAdvertisement.Seller &&
                            e.Marketplace == WellKnown.ChipFind.Marketplace,
                        cancellationToken);

                if (record is null)
                {
                    applicationDbContext.ProductEmailSendHistory.Add(
                        new ProductEmailSendHistory
                        {
                            ProductId = product.ProductId,
                            Seller = saleAdvertisement.Seller,
                            Link = saleAdvertisement.Link.ToString(),
                            CreatedAt = saleAdvertisement.Date,
                            Marketplace = WellKnown.ChipFind.Marketplace
                        });
                    newAds.Add(saleAdvertisementItem);
                }
                else
                {
                    record.Link = saleAdvertisement.Link.ToString();
                    record.CreatedAt = saleAdvertisement.Date;
                }
            }
        }

        await applicationDbContext.SaveChangesAsync(cancellationToken);

        if (newAds.Count > 0)
        {
            var newItems = string.Join("<br>", newAds);
            var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a><br><br>{newItems}";

            await _emailSender.Send(
                targetAddress: _ebayServerOptions.TargetEmail,
                topic: $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]",
                messageText: emailBody);

            await Task.Delay(millisecondsDelay: DelayAfterSendMilliseconds, cancellationToken: cancellationToken);
        }

        transaction.Complete();
    }

    private static async Task RemoveStaleAdvertisements(
        ApplicationDbContext applicationDbContext,
        CancellationToken cancellationToken)
    {
        using var transaction = TransactionScopeFactory.Create();

        var staleThreshold = DateTime.UtcNow - WellKnown.ChipFind.RemoveAdvertisementAfter;

        await applicationDbContext.ProductEmailSendHistory
            .Where(e =>
                e.Marketplace == WellKnown.ChipFind.Marketplace &&
                e.CreatedAt < staleThreshold)
            .ExecuteDeleteAsync(cancellationToken);

        transaction.Complete();
    }

    private async static Task<IReadOnlyCollection<ProductIdWithRegex>> GetInterestingProductIdsWithRegexes(
        ApplicationDbContext applicationDbContext,
        CancellationToken cancellationToken)
    {
        var dbProducts = await applicationDbContext.Products
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Include(x => x.RuSearchQueries)
            .ToListAsync(cancellationToken);

        var productsArray = dbProducts.
            Where(x => x.GetIsInteresting())
            .Select(x => new ProductIdWithRegex(ProductId: x.Id, Regex: x.GetProductRegex()))
            .ToArray();
        return productsArray;
    }
}