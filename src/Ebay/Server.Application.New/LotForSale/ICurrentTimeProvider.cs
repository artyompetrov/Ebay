namespace Server.Application.New.LotForSale;

/// <summary>
/// Предоставляет текущее UTC-время для генерации идентификаторов.
/// </summary>
public interface ICurrentTimeProvider
{
    /// <summary>
    /// Текущее время в UTC.
    /// </summary>
    DateTimeOffset UtcNow { get; }
}