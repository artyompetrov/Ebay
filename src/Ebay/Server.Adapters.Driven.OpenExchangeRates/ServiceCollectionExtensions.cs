using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.OpenExchangeRates;

public static class ServiceCollectionExtensions
{
    public static void AddOpenExchangeRatesAdapter(this IServiceCollection services)
    {
        services.AddTransient<ICurrencyRateSource, OpenExchangeRatesCurrencyRateSource>();
    }
}
