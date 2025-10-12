using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Measurements;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Application.Services.Measurement;

internal class MatchedMeasurementService
{
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly ApplicationDbContext _applicationContext;
    private readonly ILogger<MatchedMeasurementService> _logger;

    public MatchedMeasurementService(
        IPublishEndpoint publishEndpoint,
        IMeasurementQueries measurementQueries,
        ApplicationDbContext applicationContext,
        ILogger<MatchedMeasurementService> logger)
    {
        _publishEndpoint = publishEndpoint;
        _measurementQueries = measurementQueries;
        _applicationContext = applicationContext;
        _logger = logger;
    }

    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {


        var hasWorkingPoint = await _applicationContext.TubeWorkingPoints
            .AsNoTracking()
            .AnyAsync(x => x.ProductId == productId, cancellationToken);

        // todo хендлинг ошибок должен быть на уровне адаптера
        if (!hasWorkingPoint)
        {
            throw NonOkHttpAnswerException.ValidationError400(
                field: "tubeWorkingPoint",
                errors: "Рабочая точка не задана.");
        }

        var measurementStates = Enum
            .GetValues<MeasurementState>()
            .Where(state => state != MeasurementState.Sold)
            .ToArray();

        var measurementIds = (await _measurementQueries.GetMeasurementsInfo(
            productId: productId,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken)).Select(x => x.Id).ToHashSet();

        _logger.LogInformation("Starting matching task for {ProductId}, {MeasurementIds}", productId, string.Join(",", measurementIds));

        _applicationContext.MatchedPairDifferences.RemoveRange(
            _applicationContext.MatchedPairDifferences.Where(x => measurementIds.Contains(x.Measurement1Id)));

        await _applicationContext.SaveChangesAsync(cancellationToken);

        foreach (var measurementId1 in measurementIds) // todo мы тут делаем пары из измерений, находящихся в разных статусах MeasurementState, возможно не стоит так делать 
        {
            var measurements = new List<string>();
            foreach (var measurementId2 in measurementIds)
            {
                var message = new CalculateMatchedPair(
                    MeasurementId1: measurementId1,
                    MeasurementId2: measurementId2);

                await _publishEndpoint.Publish(
                    message: message,
                    cancellationToken: cancellationToken);

                measurements.Add(message.ToString());
            }
            _logger.LogInformation("Publishing {messageType}, {messageIds}", nameof(CalculateMatchedPair), string.Join(",", measurements));
            await _applicationContext.SaveChangesAsync(cancellationToken);
        }
    }
}