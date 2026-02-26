namespace Server.Application.Abstractions.Driving.Abstractions.Services.BackgroundProcessing;

public interface IChipfindMonitoringService
{
    Task ProcessRecentAdvertisementsAsync(CancellationToken cancellationToken);
}
