using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Application.Infrastructure;
using Server.Domain;

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

    private record ProductInner(Guid ProductId, Regex Regex, bool IsInteresting);

    protected async override Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_ebayServerOptions.IsLocalRun) return;

        using var scope = _serviceScopeFactory.CreateScope();
        var applicationDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        var products = await GetProducts(
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
    }

    private async Task ProcessAdvertisement(
        CancellationToken cancellationToken,
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<ProductInner> products,
        ApplicationDbContext applicationDbContext)
    {
        using var transaction = TransactionScopeFactory.Create();

        var newInterestitngAds = new HashSet<(bool IsAmbiguous, string Ad)>();
        foreach (var saleAdvertisementItem in saleAdvertisement.Items)
        {
            var matchesWithProducts = products
                .Where(x => x.Regex.IsMatch(saleAdvertisementItem))
                .ToList();

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
                    applicationDbContext.ProductEmailSendHistory.Add(
                        new ProductEmailSendHistory
                        {
                            ProductId = product.ProductId,
                            Seller = saleAdvertisement.Seller,
                            Link = saleAdvertisement.Link.ToString(),
                            CreatedAt = saleAdvertisement.Date,
                            Marketplace = WellKnown.ChipFind.Marketplace,
                            IsAmbiguous = isAmbiguous
                        });

                    if (product.IsInteresting)
                    {
                        newInterestitngAds.Add((IsAmbiguous: isAmbiguous, Ad: saleAdvertisementItem));
                    }
                }
                else
                {
                    record.Link = saleAdvertisement.Link.ToString();
                    record.CreatedAt = saleAdvertisement.Date;
                    record.IsAmbiguous = isAmbiguous;
                }
            }
        }

        await applicationDbContext.SaveChangesAsync(cancellationToken);

        if (newInterestitngAds.Count > 0)
        {
            var newItems = string.Join("<br>", values: newInterestitngAds.Select(x => (x.IsAmbiguous ? "[Нашлось несколько товаров] " : "") + x.Ad));
            var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a><br><br>{newItems}";
            var emailTopic = $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]";
            _logger.LogInformation(emailTopic);
            _logger.LogDebug(emailBody);
            await _emailSender.Send(
                targetAddress: _ebayServerOptions.TargetEmail,
                topic: emailTopic,
                messageText: emailBody);

            await Task.Delay(millisecondsDelay: DelayAfterSendMilliseconds, cancellationToken: cancellationToken);
        }

        transaction.Complete();
    }

    private async static Task<IReadOnlyCollection<ProductInner>> GetProducts(
        ApplicationDbContext applicationDbContext,
        CancellationToken cancellationToken)
    {
        var dbProducts = await applicationDbContext.Products
            .AsNoTracking()
            .OrderBy(x => x.Name)
            .ThenBy(x => x.Id)
            .Include(x => x.RuSearchQueries)
            .ToListAsync(cancellationToken);

        var productsArray = dbProducts.Select(x => new ProductInner(
                ProductId: x.Id,
                Regex: x.GetProductRegex(),
                IsInteresting: x.GetIsInteresting()))
            .ToArray();

        return productsArray;
    }
}