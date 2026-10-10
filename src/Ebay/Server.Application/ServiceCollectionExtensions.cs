using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Caching;
using Server.Application.Currencies;
using Server.Application.DbCache;
using Server.Application.LotForSale;
using Server.Application.MatchedPairs;
using Server.Application.MeasurementCaching;
using Server.Application.MeasurementPlot;
using Server.Application.PriceCalculator;
using Server.Application.SaleAdvertisements;
using Server.Application.Services;
using Server.Application.TubeWorkingPoints;

namespace Server.Application;

/// <summary>
/// Регистрация сервисов application-слоя Server.Application.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Добавляет сервисы application-слоя Server.Application в DI-контейнер.
    /// </summary>
    /// <param name="services">Коллекция сервисов приложения.</param>
    public static void AddApplication(this IServiceCollection services)
    {
        services.AddOptions<ImageCacheOptions>()
            .BindConfiguration(ImageCacheOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddTransient<MeasurementApproximationService>();
        services.AddTransient<IMeasurementService, MeasurementService>();
        services.AddTransient<IMatchedPairsCalculator, MatchedPairsCalculator>();
        services.AddTransient<ICurrentTimeProvider, SystemCurrentTimeProvider>();
        services.AddTransient<IRandomNumberProvider, CryptoRandomNumberProvider>();
        // Singleton нужен для process-wide монотонной последовательности ID и предотвращения коллизий при параллельном создании лотов.
        services.AddSingleton<ILotForSaleIdGenerator, LotForSaleIdGenerator>();
        services.AddTransient<ProductDescriptionSanitizer>();
        services.AddTransient<ProductService>();
        services.AddTransient<LotService>();
        services.AddTransient<ProductPassportService>();
        services.AddTransient<IgnoredLotService>();
        services.AddTransient<ClientErrorService>();
        services.AddTransient<MatchedMeasurementService>();
        services.AddTransient<MeasurementPlotService>();
        services.AddTransient<TubeWorkingPointService>();
        services.AddTransient<LotForSaleService>();
        services.AddTransient<MeasurementPhotoService>();
        // Singleton нужен, чтобы токены инвалидации по measurementId были общими для всех запросов процесса, а не per-request.
        services.AddSingleton<MeasurementCacheInvalidationRegistry>();
        services.AddTransient<IMeasurementStateChangedHandler, MeasurementStateChangedHandler>();
        services.AddTransient<IMeasurementMatchIdChangedHandler, MeasurementMatchIdChangedHandler>();
        services.AddTransient<ILotPriceCalculator, LotPriceCalculator>();
        services.AddTransient<IProductMetricsCalculator, ProductMetricsCalculator>();
        services.AddTransient<ChipfindMonitoringService>();
        services.AddTransient<SaleAdvertisementCleanupService>();
        services.AddTransient<CurrencyRateService>();
        services.AddTransient<DbCacheCleanupService>();
        services.AddTransient<MeasurementPlotWarmupService>();
    }
}
