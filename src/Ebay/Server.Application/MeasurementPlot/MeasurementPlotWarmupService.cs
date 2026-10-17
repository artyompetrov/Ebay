using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;

namespace Server.Application.MeasurementPlot;

/// <summary>
/// Сценарий прогрева персистентного кеша eBay-графиков: публикует команду прогрева для каждого замера.
/// </summary>
public class MeasurementPlotWarmupService
{
    /// <summary>
    /// Количество команд прогрева, коммитящихся одной транзакцией outbox.
    /// </summary>
    internal const int CommitBatchSize = 500;

    private readonly ILogger<MeasurementPlotWarmupService> _logger;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementPlotWarmupPublisher _warmupPublisher;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    /// <summary>
    /// Создает сервис прогрева кеша eBay-графиков.
    /// </summary>
    public MeasurementPlotWarmupService(
        ILogger<MeasurementPlotWarmupService> logger,
        IMeasurementQueries measurementQueries,
        IMeasurementPlotWarmupPublisher warmupPublisher,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory)
    {
        _logger = logger;
        _measurementQueries = measurementQueries;
        _warmupPublisher = warmupPublisher;
        _unitOfWorkFactory = unitOfWorkFactory;
    }

    /// <summary>
    /// Публикует команды прогрева для всех замеров, коммитя их батчами.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    public async Task PublishWarmupForAllMeasurementsAsync(CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        // Pre-populates the Postgres-backed DbCache to avoid a slow first plot render after deploy.
        // It is independent of the per-process in-memory image cache invalidated by measurement state changes.
        var measurementIds = await _measurementQueries.GetAllMeasurementIds(cancellationToken);

        foreach (var batch in measurementIds.Batch(CommitBatchSize))
        {
            foreach (var id in batch)
            {
                await _warmupPublisher.PublishAsync(unitOfWork, id, cancellationToken);
            }

            await unitOfWork.SaveChangesAsync(cancellationToken);
        }

        _logger.LogInformation("Published {Count} measurement plot warmup commands", measurementIds.Count);
    }
}
