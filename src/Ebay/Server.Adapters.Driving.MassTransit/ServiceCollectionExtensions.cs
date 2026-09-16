using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driving.MassTransit.Consumers.MeasurementWatching;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.Driving.MassTransit;

public static class ServiceCollectionExtensions
{
    public static void AddMassTransitAdapter(this IServiceCollection services)
    {
        services.AddTransient<IMeasurementWatchedOnEbayPublisher, MeasurementWatchedOnEbayPublisher>();
        services.AddTransient<IMeasurementWatchedOnEbayHandler, MeasurementWatchedOnEbayHandler>();
    }
}
