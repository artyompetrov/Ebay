using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driving.MassTransit;

public static class ServiceCollectionExtensions
{
    public static void AddMassTransitAdapter(this IServiceCollection services)
    {
        services.AddTransient<IMeasurementWatchedOnEbayPublisher, MeasurementWatchedOnEbayPublisher>();
    }
}
