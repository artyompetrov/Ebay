using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Logging;
using Npgsql.EntityFrameworkCore.PostgreSQL.Infrastructure;

namespace Server.Adapters.Driven.PostgreSql;

public static class DbContextOptionsBuilderExtensions
{
    /// <summary>
    /// Подключает DbContext к общей базе PostgreSQL с общими для всех EF-адаптеров настройками.
    /// EF Core пишет каждый выполненный SQL-запрос («Executed DbCommand») на уровне Information; для нас это
    /// детали обращения к внешней системе, поэтому событие понижено до Debug. Ошибки запросов остаются на Error.
    /// </summary>
    public static DbContextOptionsBuilder UsePostgreSql(
        this DbContextOptionsBuilder optionsBuilder,
        string connectionString,
        Action<NpgsqlDbContextOptionsBuilder>? configureNpgsql = null) =>
        optionsBuilder
            .UseNpgsql(connectionString, configureNpgsql)
            .ConfigureWarnings(static warnings => warnings.Log((RelationalEventId.CommandExecuted, LogLevel.Debug)));
}
