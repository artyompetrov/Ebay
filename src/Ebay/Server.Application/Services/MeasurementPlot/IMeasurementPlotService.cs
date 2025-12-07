namespace Server.Application.Services.MeasurementPlot;

public interface IMeasurementPlotService
{
    string PlotSold();

    Task<string?> PlotForEbayAndSaveLastEbayViewTime(
        string measurementId,
        string? lotId,
        bool sellingOnly,
        CancellationToken cancellationToken);

    Task<string?> PlotForMeasurementId(
        string measurementId,
        bool mergeVertical,
        bool legendVertical,
        bool addQuickTest,
        int width,
        int height,
        CancellationToken cancellationToken
    );

    Task<string?> GetEbayTubeDescription(
        string measurementId,
        string? lotId,
        bool sellingOnly,
        CancellationToken cancellationToken);
}