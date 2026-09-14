using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.ShippingRates;

public static class ServiceCollectionExtensions
{
    public static void AddShippingRatesAdapter(this IServiceCollection services)
    {
        services.AddTransient<IShippingRatesService, ShippingRatesService>();
    }
}