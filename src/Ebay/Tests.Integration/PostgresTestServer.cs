using Npgsql;
using Testcontainers.PostgreSql;

namespace Tests.Integration;

/// <summary>
/// The PostgreSQL server shared by all integration tests. Each test fixture creates its own scratch database on it.
/// </summary>
/// <remarks>
/// If <see cref="ExternalConnectionStringVariable"/> is set (CI, or a developer's own local server), that server is used as is.
/// Otherwise a throwaway PostgreSQL container is started with Testcontainers, so Docker is the only prerequisite.
/// </remarks>
public static class PostgresTestServer
{
    public const string ExternalConnectionStringVariable = "EBAY_TESTS_POSTGRES_CONNECTION_STRING";

    private const string Image = "postgres:16";

    private static PostgreSqlContainer? _container;
    private static string? _connectionString;

    // Connection string of the server (not of a specific database); use CreateDatabaseConnectionString for that.
    public static string ConnectionString => _connectionString
        ?? throw new InvalidOperationException($"{nameof(PostgresTestServer)} is not started.");

    public static async Task StartAsync()
    {
        var externalConnectionString = Environment.GetEnvironmentVariable(ExternalConnectionStringVariable);
        if (!string.IsNullOrWhiteSpace(externalConnectionString))
        {
            _connectionString = externalConnectionString;
            return;
        }

        _container = new PostgreSqlBuilder(Image).Build();
        await _container.StartAsync();
        _connectionString = _container.GetConnectionString();
    }

    public static async Task StopAsync()
    {
        if (_container is not null)
        {
            await _container.DisposeAsync();
            _container = null;
        }

        _connectionString = null;
    }

    public static string CreateDatabaseConnectionString(string databaseName)
    {
        return new NpgsqlConnectionStringBuilder(ConnectionString) { Database = databaseName }.ConnectionString;
    }

    public static async Task DropDatabaseAsync(string databaseName)
    {
        var adminConnectionStringBuilder = new NpgsqlConnectionStringBuilder(ConnectionString)
        {
            Database = "postgres",
            Pooling = false
        };

        await using var connection = new NpgsqlConnection(adminConnectionStringBuilder.ConnectionString);
        await connection.OpenAsync();

        await using (var terminateCommand = connection.CreateCommand())
        {
            terminateCommand.CommandText =
                """
                SELECT pg_terminate_backend(pid)
                FROM pg_stat_activity
                WHERE datname = @name
                  AND pid <> pg_backend_pid();
                """;
            terminateCommand.Parameters.AddWithValue("name", databaseName);
            await terminateCommand.ExecuteNonQueryAsync();
        }

        await using var dropCommand = connection.CreateCommand();
        dropCommand.CommandText = $"""DROP DATABASE IF EXISTS "{databaseName}";""";
        await dropCommand.ExecuteNonQueryAsync();
    }
}
