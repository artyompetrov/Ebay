using Ebay.Server.Controllers.Generated;
using Ebay.Server.Data;
using Microsoft.EntityFrameworkCore;

// ReSharper disable IdentifierTypo

namespace Ebay.Server.Services.Statistics;

internal class StatisticService
{
    private readonly ApplicationDbContext _applicationContext;

    private const double СкидкаНаПродажиСНеизвестнойЦеной = 0.2;
    private const double КоммисияEbayВПроцентах = 0.1325;
    private const double КоммиссияEbayПостояннаяВеличина = 0.1325;
    private const double КоммисияPayoneerВПроцентах = 0.05; //todo уточнить

    public StatisticService(
        ApplicationDbContext applicationContext
    )
    {
        _applicationContext = applicationContext;
    }

    public Statistic GenerateStatistics(Guid productId)
    {
        var conditions = new List<string>();
        var testStates = new List<string>();
        var itemsInPurchase = new List<int>();
        var profitPerPcs = new List<double>();

        foreach (var lot in _applicationContext.Lots
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .Include(x => x.Currency)
            .Include(x => x.Purchases))
        {
            foreach (var lotPurchase in lot.Purchases)
            {
                conditions.Add(lot.Categories[WellKnown.Categories.Conditions.CategoryName]);
                testStates.Add(lot.Categories[WellKnown.Categories.TestState.CategoryName]);

                var количествоШтукВПродаже = lot.Pcs * lotPurchase.Quantity;
                itemsInPurchase.Add(количествоШтукВПродаже);

                var ценаЛотаВВалютеЛота = lotPurchase.Price ?? lot.Price * (1.0 - СкидкаНаПродажиСНеизвестнойЦеной);

                var полнаяЦенаПродажиВВалютеЛота =
                    ценаЛотаВВалютеЛота * lotPurchase.Quantity + lot.Shipping +
                    lot.ShippingAdditional * (lotPurchase.Quantity - 1);

                var полнаяЦенаПродажиВДолларах = полнаяЦенаПродажиВВалютеЛота * lot.Currency.CurrencyRate;

                var выручкаСПродажиВДолларах = полнаяЦенаПродажиВДолларах -
                    полнаяЦенаПродажиВДолларах * КоммисияEbayВПроцентах - КоммиссияEbayПостояннаяВеличина -
                    полнаяЦенаПродажиВДолларах * КоммисияPayoneerВПроцентах;
                //todo нужно добавить сюда учет стоимости доставки

                var выручкаСПродажиЗаШтуку = выручкаСПродажиВДолларах / количествоШтукВПродаже;

                profitPerPcs.Add(выручкаСПродажиЗаШтуку);
            }
        }

        return new Statistic(
            new Purchases(
                conditions: conditions,
                itemsInPurchase: itemsInPurchase,
                profitPerPcs: profitPerPcs,
                testStates: testStates
            )
        );
    }
}