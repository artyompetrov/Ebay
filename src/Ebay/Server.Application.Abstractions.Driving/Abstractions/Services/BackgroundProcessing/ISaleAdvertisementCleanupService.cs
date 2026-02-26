namespace Server.Application.Abstractions.Driving.Abstractions.Services.BackgroundProcessing;

public interface ISaleAdvertisementCleanupService
{
    Task CleanupAsync(CancellationToken cancellationToken);
}
