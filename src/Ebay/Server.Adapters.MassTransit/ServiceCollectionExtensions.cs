using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.WriteModel;
using Server.Adapters.MassTransit.Driven;
using Server.Adapters.MassTransit.Driving.EbayCurvesCacheWarmUp;
using Server.Adapters.MassTransit.Driving.MatchedPairs;
using Server.Adapters.MassTransit.Driving.MeasurementCaching;
using Server.Adapters.MassTransit.Driving.PriceCalculator;
using Server.Adapters.MassTransit.Driving.MeasurementWatching;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driving.Abstractions.Services;

namespace Server.Adapters.MassTransit;

public static class ServiceCollectionExtensions
{
    public static void AddMassTransitAdapter(this IServiceCollection services)
    {
        services.AddSingleton<IMeasurementWatchedOnEbayPublisher, MeasurementWatchedOnEbayPublisher>();
        services.AddSingleton<IMeasurementWatchedOnEbayHandler, MeasurementWatchedOnEbayHandler>();
        services.AddSingleton<IPriceRecalculationPublisher, PriceRecalculationPublisher>();
        services.AddSingleton<IMeasurementPlotWarmupPublisher, MeasurementPlotWarmupPublisher>();

        services.AddOptions<SqlTransportOptions>()
            .Configure<IConfiguration>((o, cfg) =>
            {
                o.ConnectionString = cfg.GetConnectionString("DefaultConnection")
                                    ?? throw new InvalidOperationException("Connection string cannot be null");
            });

        services.AddPostgresMigrationHostedService(x =>
        {
            x.CreateDatabase = false;
            x.CreateInfrastructure = true;
        });

        services.AddMassTransit(x =>
        {
            x.AddConsumer<CalculatePricesForAllConsumer>();
            x.AddConsumer<CalculatePricesForProductConsumer>();
            x.AddConsumer<CalculatePricesForLotConsumer>();
            x.AddConsumer<MeasurementWatchedOnEbayConsumer>();
            x.AddConsumer<MeasurementStateChangedConsumer>();
            x.AddConsumer<MeasurementMatchIdChangedConsumer>();
            x.AddConsumer<CalculateEbayCurvesForMeasurementConsumer>(c =>
            {
                c.UseConcurrencyLimit(10);
            });
            x.AddConsumer<MatchedPairsCalculatorConsumer>(c =>
            {
                c.UseConcurrencyLimit(1);
            });
            x.AddConsumer<CalculateMetricsForProductConsumer>(c => c.Options<BatchOptions>(o =>
            {
                o.ConcurrencyLimit = 1;
                o.MessageLimit = 100;
            }));

            x.AddEntityFrameworkOutbox<WriteModelDbContext>(o =>
            {
                o.UsePostgres();
                o.UseBusOutbox();
            });

            x.AddSqlMessageScheduler();

            x.UsingPostgres((context, cfg) =>
            {
                cfg.UseSqlMessageScheduler();
                cfg.ConfigureEndpoints(context);
            });
        });
    }
}
