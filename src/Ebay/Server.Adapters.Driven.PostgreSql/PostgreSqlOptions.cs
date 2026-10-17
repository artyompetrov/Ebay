using System.ComponentModel.DataAnnotations;

namespace Server.Adapters.Driven.PostgreSql;

/// <summary>
/// Подключение к общей базе PostgreSQL, которую используют EF-адаптеры и транспорт MassTransit.
/// Привязывается к стандартной секции <c>ConnectionStrings</c> (переменная окружения
/// <c>ConnectionStrings__DefaultConnection</c>).
/// </summary>
public sealed record PostgreSqlOptions
{
    public const string SectionName = "ConnectionStrings";

    [Required]
    public required string DefaultConnection { get; init; }
}
