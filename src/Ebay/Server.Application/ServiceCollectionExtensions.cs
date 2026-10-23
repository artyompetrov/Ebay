using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Currencies;
using Server.Application.DbCache;
using Server.Application.LotForSale;
using Server.Application.MatchedPairs;
using Server.Application.MeasurementCaching;
using Server.Application.MeasurementPlot;
using Server.Application.PriceCalculator;
using Server.Application.SaleAdvertisements;
using Server.Application.SigningKeys;
using Server.Application.TubeWorkingPoints;
using Server.Domain.Product;

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
        services.AddSingleton<IMeasurementService, MeasurementService>();
        services.AddSingleton<IMatchedPairsCalculator, MatchedPairsCalculator>();
        services.AddSingleton<ICurrentTimeProvider, SystemCurrentTimeProvider>();
        services.AddSingleton<IRandomNumberProvider, CryptoRandomNumberProvider>();
        // Singleton нужен для process-wide монотонной последовательности ID и предотвращения коллизий при параллельном создании лотов.
        services.AddSingleton<ILotForSaleIdGenerator, LotForSaleIdGenerator>();
        services.AddSingleton<ProductDescriptionSanitizer>();
        services.AddSingleton<ProductService>();
        services.AddSingleton<LotService>();
        services.AddSingleton<ProductPassportService>();
        services.AddSingleton<IgnoredLotService>();
        services.AddSingleton<ClientErrorService>();
        services.AddSingleton<MatchedMeasurementService>();
        services.AddSingleton<MeasurementPlotService>();
        services.AddSingleton<TubeWorkingPointService>();
        services.AddSingleton<LotForSaleService>();
        services.AddSingleton<MeasurementPhotoService>();
        services.AddSingleton<IMeasurementStateChangedHandler, MeasurementStateChangedHandler>();
        services.AddSingleton<IMeasurementMatchIdChangedHandler, MeasurementMatchIdChangedHandler>();
        services.AddSingleton<ILotPriceCalculator, LotPriceCalculator>();
        services.AddSingleton<IProductMetricsCalculator, ProductMetricsCalculator>();
        services.AddSingleton<SaleAdvertisementMonitoringService>();
        services.AddSingleton<SaleAdvertisementCleanupService>();
        services.AddSingleton<CurrencyRateService>();
        services.AddSingleton<DbCacheCleanupService>();
        services.AddSingleton<SigningKeyCleanupService>();
        services.AddSingleton<MeasurementPlotWarmupService>();
    }
}
