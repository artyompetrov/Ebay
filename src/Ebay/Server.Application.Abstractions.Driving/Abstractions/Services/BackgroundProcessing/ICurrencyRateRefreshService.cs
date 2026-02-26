namespace Server.Application.Abstractions.Driving.Abstractions.Services.BackgroundProcessing;

public interface ICurrencyRateRefreshService
{
    Task RefreshAsync(CancellationToken cancellationToken);
}
