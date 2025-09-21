using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Application.Data.Models;
using Server.Application.Services.Measurement;

namespace Server.Application.Consumers.MatchedPairs;

public class MatchedPairsCalculator : IConsumer<CalculateMatchedPair>
{
    private readonly ILogger<MatchedPairsCalculator> _logger;
    private readonly MeasurementService _measurementService;
    private readonly ApplicationDbContext _applicationDbContext;

    public MatchedPairsCalculator(
        ILogger<MatchedPairsCalculator> logger,
        MeasurementService measurementService,
        ApplicationDbContext applicationDbContext
        )
    {
        _logger = logger;
        _measurementService = measurementService;
        _applicationDbContext = applicationDbContext;
    }

    public async Task Consume(ConsumeContext<CalculateMatchedPair> context)
    {
        _logger.LogInformation(
            message: "{MeasurementId1} {MeasurementId2}",
            context.Message.MeasurementId1,
            context.Message.MeasurementId2);

        var measurementId1 = await _measurementService.GetMeasurement(
            cancellationToken: context.CancellationToken,
            measurementId: context.Message.MeasurementId1);

        var measurementId2 = await _measurementService.GetMeasurement(
            cancellationToken: context.CancellationToken,
            measurementId: context.Message.MeasurementId2);

        if (measurementId1 == null || measurementId2 == null)
        {
            return;
        }

        var model1 = RbfModel(measurementId1);
        var model2 = RbfModel(measurementId2);

        var workingPoint = await _applicationDbContext.TubeWorkingPoints
            .AsNoTracking()
            .SingleOrDefaultAsync(
                x => x.ProductId == measurementId1.ProductId,
                cancellationToken: context.CancellationToken);

        if (workingPoint == null)
        {
            _logger.LogError(
                message: "Tube working point not found for product {ProductId}",
                measurementId1.ProductId);
            return;
        }

        var (mse, rmse, maxAbs) = SquaredDiffPointsInEllipse(
            model1: model1,
            model2: model2,
            cx: workingPoint.AnodeVoltage,
            cy: workingPoint.GridVoltage,
            ax: workingPoint.AnodeVoltageHalfWidth,
            by: workingPoint.GridVoltageHalfWidth,
            radialBands: 10,
            pointsPerBand: 36);

        var pairDifference = await _applicationDbContext.MatchedPairDifferences
            .SingleOrDefaultAsync(
                x => x.MeasurementId1 == context.Message.MeasurementId1 &&
                     x.MeasurementId2 == context.Message.MeasurementId2,
                cancellationToken: context.CancellationToken);

        if (pairDifference == null)
        {
            pairDifference = new MatchedPairDifference
            {
                MeasurementId1 = context.Message.MeasurementId1,
                MeasurementId2 = context.Message.MeasurementId2
            };

            _applicationDbContext.MatchedPairDifferences.Add(pairDifference);
        }

        pairDifference.Mse = mse;
        pairDifference.Rmse = rmse;
        pairDifference.MaxAbs = maxAbs;

        await _applicationDbContext.SaveChangesAsync(context.CancellationToken);
    }

    /// <summary>
    /// Функция создает модель при помощи RBF интерполяции
    /// </summary>
    /// <param name="measurement"></param>
    /// <returns></returns>
    private static alglib.rbfmodel RbfModel(MeasurementData measurement)
    {
        var points = new List<(double Va, double Vg, double Ia)>();
        foreach (var result in measurement.AnodeCurves.CurveSets)
        {
            foreach (var (va, ia) in result.V.Zip(second: result.I1, (va, ia) => (va, ia)))
            {
                points.Add((Va: va, Vg: result.VSteppingValue, Ia: ia));
            }

        }

        var xy = new double[points.Count, 3];
        for (var i = 0; i < points.Count; i++)
        {
            xy[i, 0] = points[i].Va;
            xy[i, 1] = points[i].Vg;
            xy[i, 2] = points[i].Ia;
        }

        var vaRange = points.Max(p => p.Va) - points.Min(p => p.Va);
        var vgRange = points.Max(p => p.Vg) - points.Min(p => p.Vg);
        double rbase = Math.Max(val1: vaRange, val2: vgRange);


        var layers = 6;
        double lambda = 0.0;
        alglib.rbfcreate(nx: 2, ny: 1, s: out var model);
        alglib.rbfsetpoints(s: model, xy: xy);
        alglib.rbfsetalgomultilayer(s: model, rbase: rbase,nlayers: layers, lambdav: lambda);
        alglib.rbfbuildmodel(s: model, rep: out _);
        return model;
    }

    /// <summary>
    /// Функция считает ошибку между двумя интерполированными плоскостями
    /// </summary>
    /// <param name="model1">Модель 1</param>
    /// <param name="model2">Модель 2</param>
    /// <param name="cx">Центр X</param>
    /// <param name="cy">Центр Y</param>
    /// <param name="ax">Полуось по оси X</param>
    /// <param name="by">Полуось по оси Y</param>
    /// <param name="radialBands">Количество элипсов вокруг рабочей точки</param>
    /// <param name="pointsPerBand">Количество точек на элипсе</param>
    /// <param name="phiRad">Поворот элипса</param>
    /// <returns></returns>
    static (double mse, double rmse, double maxAbs) SquaredDiffPointsInEllipse(
        alglib.rbfmodel model1,
        alglib.rbfmodel model2,
        double cx,
        double cy,
        double ax,
        double by,
        int radialBands,        // колец по радиусу
        int pointsPerBand,      // точек на кольцо
        double phiRad = 0.0     // поворот (рад)
    )
    {
        var c = Math.Cos(phiRad);
        var s = Math.Sin(phiRad);

        var sse = 0.0;     // sum of squared errors
        var maxAbs = 0.0;
        long count = 0;

        for (var i = 1; i <= radialBands; i++)
        {
            // midpoint по радиусу, чтобы не попадать на границы
            var r = (i - 0.5) / radialBands;

            for (var j = 0; j < pointsPerBand; j++)
            {
                var theta = 2 * Math.PI * j / pointsPerBand;

                // точка эллипса до поворота
                var ex = ax * r * Math.Cos(theta);
                var ey = by * r * Math.Sin(theta);

                // поворот
                var rx = c * ex - s * ey;
                var ry = s * ex + c * ey;

                var va = cx + rx;
                var vg = cy + ry;

                var d = alglib.rbfcalc2(s: model1, x0: va, x1: vg) - alglib.rbfcalc2(s: model2, x0: va, x1: vg);
                var ad = Math.Abs(d);

                sse += d * d;
                if (ad > maxAbs) maxAbs = ad;
                count++;
            }
        }

        var mse = count > 0 ? sse / count : 0.0;
        var rmse = Math.Sqrt(mse);
        return (mse, rmse, maxAbs);
    }
}

public record CalculateMatchedPair(string MeasurementId1, string MeasurementId2);
