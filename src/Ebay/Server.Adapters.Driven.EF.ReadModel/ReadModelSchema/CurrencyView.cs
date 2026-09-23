using System.Linq.Expressions;
using Server.Domain;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class CurrencyView : IViewProjection<Currency, CurrencyView>
{
    public required string Id { get; set; }

    public required string CurrencyRusName { get; set; }

    public required string CurrencyApiName { get; set; }

    public required double CurrencyRate { get; set; }

    public required DateTimeOffset LastUpdate { get; set; }

    public static Expression<Func<Currency, CurrencyView>> ToView => x =>
        new()
        {
            Id = x.Id,
            CurrencyRusName = x.CurrencyRusName,
            CurrencyApiName = x.CurrencyApiName,
            CurrencyRate = x.CurrencyRate,
            LastUpdate = x.LastUpdate
        };
}
