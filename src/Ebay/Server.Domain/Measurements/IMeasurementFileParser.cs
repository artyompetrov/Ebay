namespace Server.Domain.Measurements;

/// <summary>
/// контракт.
/// </summary>
public interface IMeasurementFileParser
{
    /// <summary>
    /// Разбирает файл измерений и возвращает структуру доменной модели.
    /// </summary>
    MeasurementFileParseResult Parse(byte[] measurements);

    /// <summary>
    /// Нормализует ZIP-архив с измерениями и возвращает его в удобочитаемом виде.
    /// </summary>
    Task<byte[]> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken);
}
