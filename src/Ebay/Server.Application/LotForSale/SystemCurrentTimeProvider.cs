namespace Server.Application.LotForSale;

/// <summary>
/// Системная реализация провайдера UTC-времени.
/// </summary>
public sealed class SystemCurrentTimeProvider : ICurrentTimeProvider
{
    /// <inheritdoc />
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}