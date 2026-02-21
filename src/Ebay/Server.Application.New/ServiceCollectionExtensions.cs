using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driving.Abstractions.Services;

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
        _ = services.AddScoped<IMeasurementService, MeasurementService>();
    }
}
