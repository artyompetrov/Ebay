using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Server.Adapters.Driven.PostgreSql;

public static class ServiceCollectionExtensions
{
    /// <summary>
    /// Регистрирует <see cref="PostgreSqlOptions"/>. Вызывается каждым адаптером, которому нужна база,
    /// поэтому повторный вызов ничего не добавляет: иначе привязка и валидация выполнялись бы по разу на адаптер.
    /// </summary>
    public static void AddPostgreSqlOptions(this IServiceCollection services)
    {
        if (services.Any(static d => d.ServiceType == typeof(IValidateOptions<PostgreSqlOptions>)))
        {
            return;
        }

        services.AddOptions<PostgreSqlOptions>()
            .BindConfiguration(PostgreSqlOptions.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();
    }
}
