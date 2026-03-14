using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driving.Abstractions.Services;
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
        services.AddTransient<MeasurementApproximationService>();
        services.AddTransient<IMeasurementService, MeasurementService>();
        services.AddTransient<IMatchedPairsCalculator, MatchedPairsCalculator>();
        services.AddTransient<ICurrentTimeProvider, SystemCurrentTimeProvider>();
        services.AddTransient<IRandomNumberProvider, CryptoRandomNumberProvider>();
        // Singleton нужен для process-wide монотонной последовательности ID и предотвращения коллизий при параллельном создании лотов.
        services.AddSingleton<ILotForSaleIdGenerator, LotForSaleIdGenerator>();
        services.AddTransient<ProductService>();
        services.AddTransient<LotForSaleService>();
    }
}