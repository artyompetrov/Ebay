using System.Transactions;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Data.Models;
using Server.Services;

namespace Server.Consumers;

internal class LotChangedConsumer : IConsumer<LotChanged>
{
    private readonly ApplicationDbContext _applicationContext;
    private readonly ILogger<ProductChangedConsumer> _logger;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly Dictionary<string, List<ShippingRatesService.ShippingRateInner>> _shippingRates;

    public LotChangedConsumer(
        ApplicationDbContext applicationContext,
        ShippingRatesService shippingRatesService,
        ILogger<ProductChangedConsumer> logger, IPublishEndpoint publishEndpoint)
    {
        _applicationContext = applicationContext;
        _logger = logger;
        _publishEndpoint = publishEndpoint;

        _shippingRates = shippingRatesService.GetShippingRatesDictionary();
    }

    public async Task Consume(ConsumeContext<LotChanged> context)
    {
        using var transaction = new TransactionScope(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
                { IsolationLevel = IsolationLevel.ReadCommitted }
        );

        
        var currencyRates = await _applicationContext.Currencies
            .AsNoTracking()
            .ToDictionaryAsync(x => x.CurrencyEbayName, x => x.CurrencyRate, context.CancellationToken);

        var lot = await _applicationContext.Lots.Include(lot => lot.Purchases)
                      .SingleOrDefaultAsync(x => x.Id == context.Message.LotId) ??
                  throw new InvalidOperationException($"Lot with {context.Message.LotId} not found");
        var product =
            await _applicationContext.Products.AsNoTracking().SingleOrDefaultAsync(x => x.Id == lot.ProductId) ??
            throw new InvalidOperationException($"Product with {lot.ProductId} not found");

        // ReSharper disable IdentifierTypo
        const double скидкаНаПродажиСНеизвестнойЦеной = 0.2;
        const double коммисияEbayВПроцентах = 0.1325;
        const double коммиссияEbayПостояннаяВеличина = 0.1325;
        const double коммисияPayoneerВПроцентах = 0.05; //todo уточнить
        const double множительДляУчетаВесаУпаковки = 1.5;

        var общееКоличествоШтукВоВсехПродажах = 0;
        var общаяВыручкаВДолларах = 0.0;

        foreach (var purchase in lot.Purchases)
        {
            var количествоШтукВПродаже = lot.Pcs * purchase.Quantity;

            var ценаДоставкиВДоллларах = GetShippingPrice(
                shippingCountry: lot.ShippingCountry,
                weight: product.Weight * количествоШтукВПродаже * множительДляУчетаВесаУпаковки,
                currencyRates: currencyRates);

            var ценаЛотаВВалютеЛота = purchase.Price ?? lot.Price * (1.0 - скидкаНаПродажиСНеизвестнойЦеной);
            var ценаДоставкиВВалютеЛота = lot.Shipping + lot.ShippingAdditional * (purchase.Quantity - 1);

            var полнаяЦенаПродажиВВалютеЛота = ценаЛотаВВалютеЛота * purchase.Quantity + ценаДоставкиВВалютеЛота;

            var полнаяЦенаПродажиВДолларах = полнаяЦенаПродажиВВалютеЛота / currencyRates[lot.CurrencyId];

            var выручкаСПродажиВДолларах = полнаяЦенаПродажиВДолларах
                                           - полнаяЦенаПродажиВДолларах * коммисияEbayВПроцентах
                                           - коммиссияEbayПостояннаяВеличина
                                           - полнаяЦенаПродажиВДолларах * коммисияPayoneerВПроцентах
                                           - ценаДоставкиВДоллларах;

            общееКоличествоШтукВоВсехПродажах += количествоШтукВПродаже;
            общаяВыручкаВДолларах += выручкаСПродажиВДолларах;
        }

        lot.LotCalculationResult = new LotCalculationResult
        {
            Revenue = общаяВыручкаВДолларах,
            PurchaseQuantity = общееКоличествоШтукВоВсехПродажах
        };

        await _applicationContext.SaveChangesAsync(context.CancellationToken);
        // ReSharper restore IdentifierTypo
        
        transaction.Complete();
    }



    private double GetShippingPrice(string shippingCountry, double weight, Dictionary<string, double> currencyRates)
    {
        if (!_shippingRates.TryGetValue(key: shippingCountry, value: out var shippingRates))
        {
            throw new InvalidOperationException($"{shippingCountry} not found in shippingRates");
        }

        var prices = _shippingRates[ShippingRatesService.Worldwide].Concat(shippingRates).ToList();

        try
        {
            return prices.Where(x => x.WeightFrom <= weight && weight <= x.WeightTo)
                .Select(x => x.Price / currencyRates[x.Currency]).Min(x => x);
        }
        catch (Exception)
        {
            var pricesString = string.Join(", ", prices);
            _logger.LogError(
                $"Error while calculating shipping price for {shippingCountry}, and weight {weight}, prices: '{pricesString}'");

            throw;
        }

    }
}

public record LotChanged(long LotId);
