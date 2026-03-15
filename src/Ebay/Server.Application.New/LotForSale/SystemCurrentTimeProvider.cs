namespace Server.Application.New.LotForSale;

/// <summary>
/// Системная реализация провайдера UTC-времени.
/// </summary>
public sealed class SystemCurrentTimeProvider : ICurrentTimeProvider
{
    /// <inheritdoc />
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}