using OneOf;
using Server.Domain.Errors;

namespace Server.Domain.Measurements;

public interface IMeasurementFileParser
{
    /// <summary>
    /// Parses a uTracer measurement archive; an archive that is not a valid measurement is a <see cref="DomainError"/>.
    /// </summary>
    OneOf<MeasurementFileParseResult, DomainError> Parse(byte[] measurements);

    /// <summary>
    /// Repacks a uTracer measurement archive with human-readable file names.
    /// </summary>
    Task<OneOf<byte[], DomainError>> ToPrettifiedZip(byte[] zipBytes, CancellationToken cancellationToken);
}
