namespace Server.Domain.Measurements;

public interface IMeasurementFileParser
{
    MeasurementFileParseResult Parse(byte[] measurements);
}