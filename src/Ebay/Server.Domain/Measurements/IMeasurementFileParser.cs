namespace Server.Domain.Measurements;

public interface IMeasurementFileParser
{
    MeasurementFileParseResult Parse(byte[] measurements);

    Task<byte[]> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken);
}