using System.Text.RegularExpressions;
using Server.Application.Data.HostedServices;
using Server.Application.Infrastructure;
using Server.Application.New;
using Server.Domain;

namespace Server.Application.HostedServices.ChipFind;

public class ChipfindMonitoringService
{
    private readonly EbayServerOptions _ebayServerOptions;
    private readonly IChipfindAdapter _chipfindAdapter;
    private readonly IEmailSender _emailSender;
    private readonly ProductService _productService;
    private readonly IProductEmailSendHistoryRepository _productEmailSendHistoryRepository;
    private const int DelayMilliseconds = 5000;

    public ChipfindMonitoringService(
        EbayServerOptions ebayServerOptions,
        IChipfindAdapter chipfindAdapter,
        IEmailSender emailSender,
        ProductService productService,
        IProductEmailSendHistoryRepository productEmailSendHistoryRepository)
    {
        _ebayServerOptions = ebayServerOptions;
        _chipfindAdapter = chipfindAdapter;
        _emailSender = emailSender;
        _productService = productService;
        _productEmailSendHistoryRepository = productEmailSendHistoryRepository;
    }

    public async Task ProcessRecentAdvertisementsAsync(CancellationToken cancellationToken)
    {
        if (_ebayServerOptions.IsLocalRun)
        {
            return;
        }

        var products = await GetProducts(cancellationToken);
        var recentAdvertisements = await _chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);

        foreach (var saleAdvertisement in recentAdvertisements)
        {
            await ProcessAdvertisement(saleAdvertisement, products, cancellationToken);
        }
    }

    private async Task ProcessAdvertisement(
        SaleAdvertisement saleAdvertisement,
        IReadOnlyCollection<ProductInner> products,
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

            advertisementContact = await _chipfindAdapter.TryGetAdvertisementContactAsync(
                saleAdvertisement,
                cancellationToken);

            var isAmbiguous = matchesWithProducts.Count > 1;

            foreach (var product in matchesWithProducts)
            {
                var record = await _productEmailSendHistoryRepository.GetByProductAndSellerAsync(
                    product.ProductId,
                    saleAdvertisement.Seller,
                    WellKnown.ChipFind.Marketplace,
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

                    if (!string.IsNullOrWhiteSpace(advertisementContact))
                    {
                        newRecord.Contact = advertisementContact;
                    }

                    await _productEmailSendHistoryRepository.AddAsync(newRecord, cancellationToken);

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

        await _productEmailSendHistoryRepository.SaveChangesAsync(cancellationToken);

        if (newInterestingAds.Count > 0)
        {
            var newItems = string.Join(" ",
                values: newInterestingAds.Select(x =>
                        x.Ad + (x.IsAmbiguous ? " [Нашлось несколько товаров] " : "")
                    ).Select(x => $"<div>{x}</div>")
            );
            var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a><br><br>{newItems}<br><div>{advertisementContact}</div>";
            var emailTopic = $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]";
            await _emailSender.Send(
                targetAddress: _ebayServerOptions.TargetEmail,
                topic: emailTopic,
                messageText: emailBody);

            await Task.Delay(millisecondsDelay: DelayMilliseconds, cancellationToken: cancellationToken);
        }

        transaction.Complete();
    }

    private async Task<IReadOnlyCollection<ProductInner>> GetProducts(CancellationToken cancellationToken)
    {
        var products = await _productService.GetAllProductsAsync(cancellationToken);

        return products.Select(x => new ProductInner(
                ProductId: x.Data.Id,
                Regex: x.ProductRegex,
                IsInteresting: x.IsInteresting))
            .ToArray();
    }

    private record ProductInner(Guid ProductId, Regex Regex, bool IsInteresting);
}
