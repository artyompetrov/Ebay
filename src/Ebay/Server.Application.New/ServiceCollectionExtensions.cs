using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Application.Abstractions.Driving.Abstractions.Services.BackgroundProcessing;
using Server.Application.New.LotForSale;
using Server.Application.New.MatchedPairs;
using Server.Application.New.Services;

namespace Server.Application.New;

/// <summary>
/// Регистрация сервисов application-слоя Server.Application.New.
/// </summary>
public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Добавляет сервисы application-слоя Server.Application.New в DI-контейнер.
    /// </summary>
    /// <param name="services">Коллекция сервисов приложения.</param>
    public static void AddApplicationNewServices(this IServiceCollection services)
    {
        services.AddSingleton<MeasurementApproximationService>();
        services.AddScoped<IMeasurementService, MeasurementService>();
        services.AddScoped<IMatchedPairsCalculator, MatchedPairsCalculator>();
        services.AddSingleton<ICurrentTimeProvider, SystemCurrentTimeProvider>();
        services.AddSingleton<IRandomNumberProvider, CryptoRandomNumberProvider>();
        services.AddSingleton<ILotForSaleIdGenerator, LotForSaleIdGenerator>();
        services.AddScoped<ProductService>();
        services.AddScoped<LotForSaleService>();
        services.AddScoped<ISaleAdvertisementCleanupService, SaleAdvertisementCleanupService>();
        services.AddScoped<IChipfindMonitoringService, ChipfindMonitoringService>();
        services.AddScoped<ICurrencyRateRefreshService, CurrencyRateRefreshService>();
    }
}