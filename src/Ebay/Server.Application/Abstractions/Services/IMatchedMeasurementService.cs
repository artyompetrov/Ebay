namespace Server.Application.Abstractions.Services;

public interface IMatchedMeasurementService
{
    Task FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken);
}