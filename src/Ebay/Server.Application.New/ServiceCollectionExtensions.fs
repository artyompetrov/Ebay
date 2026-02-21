namespace Server.Application.New

open System.Runtime.CompilerServices
open Microsoft.Extensions.DependencyInjection
open Server.Application.New.Abstractions.Services
open Server.Application.New.Services

/// <summary>
/// Регистрация сервисов application-слоя Server.Application.New.
/// </summary>
[<Extension>]
type ServiceCollectionExtensions =
    /// <summary>
    /// Добавляет сервисы application-слоя Server.Application.New в DI-контейнер.
    /// </summary>
    /// <param name="services">Коллекция сервисов приложения.</param>
    [<Extension>]
    static member AddApplicationNewServices(services: IServiceCollection) =
        services.AddScoped<IMeasurementService, MeasurementService>()