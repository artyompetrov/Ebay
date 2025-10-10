using System.Text;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Consumers.MatchedPairs;
using Server.Application.Controllers;
using Server.Application.Data;
using Server.Domain.Measurements;

namespace Server.Application.Services.Measurement;

public class MatchedMeasurementService
{
    private readonly MeasurementService _measurementService;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly ApplicationDbContext _applicationContext;
    private readonly ILogger<MatchedMeasurementService> _logger;

    public MatchedMeasurementService(
        MeasurementService measurementService,
        IPublishEndpoint publishEndpoint,
        ApplicationDbContext applicationContext,
        ILogger<MatchedMeasurementService> logger)
    {
        _measurementService = measurementService;
        _publishEndpoint = publishEndpoint;
        _applicationContext = applicationContext;
        _logger = logger;
    }

    public async Task FindMatchedMeasurementsAsync(
        Guid productId,
        CancellationToken cancellationToken)
    {
        _logger.LogInformation("Starting matching task for {ProductId}", productId);
        
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

        var measurementIds = (await _measurementService.GetMeasurementIds(
            productId: productId,
            measurementStates: measurementStates,
            cancellationToken: cancellationToken)).ToHashSet();

        _applicationContext.MatchedPairDifferences.RemoveRange(
            _applicationContext.MatchedPairDifferences.Where(x => measurementIds.Contains(x.MeasurementId1)));

        foreach (var measurementId1 in measurementIds)
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
            _logger.LogInformation("Publishing {messageType}, {messageIds}", nameof(CalculateMatchedPair),  string.Join(",", measurements));
            await _applicationContext.SaveChangesAsync(cancellationToken);
        }
    }
}