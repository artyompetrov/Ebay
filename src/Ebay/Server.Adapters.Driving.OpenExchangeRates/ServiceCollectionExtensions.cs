using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions.Services;

namespace Server.Adapters.Driving.OpenExchangeRates;

public static class ServiceCollectionExtensions
{
    public static void AddOpenExchangeRatesAdapter(this IServiceCollection services)
    {
        _ = services.AddScoped<ICurrencyRatesGateway, OpenExchangeRatesGateway>();
    }
}
