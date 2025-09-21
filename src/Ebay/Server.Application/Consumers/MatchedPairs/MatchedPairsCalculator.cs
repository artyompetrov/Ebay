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
            "{MeasurementId1} {MeasurementId2}",
            context.Message.MeasurementId1,
            context.Message.MeasurementId2);

        var measurementId1 = await _measurementService.GetMeasurement(
            context.CancellationToken,
            context.Message.MeasurementId1);

        var measurementId2 = await _measurementService.GetMeasurement(
            context.CancellationToken,
            context.Message.MeasurementId2);

        if (measurementId1 == null || measurementId2 == null)
        {
            return;
        }

        var model1 = Rbfmodel(measurementId1);
        var model2 = Rbfmodel(measurementId2);

        var (mse, rmse, maxAbs) = SquaredDiffPointsInEllipse(
            model1,
            model2,
            150,
            -3.0,
            a: 30,
            b: 0.6,
            radialBands: 20,
            pointsPerBand: 36);

        var matchedPair = await _applicationDbContext.MatchedPairDifferences
            .SingleOrDefaultAsync(
                x => x.MeasurementId1 == context.Message.MeasurementId1 &&
                     x.MeasurementId2 == context.Message.MeasurementId2,
                context.CancellationToken);

        if (matchedPair == null)
        {
            matchedPair = new MatchedPairDifference
            {
                MeasurementId1 = context.Message.MeasurementId1,
                MeasurementId2 = context.Message.MeasurementId2
            };

            _applicationDbContext.MatchedPairDifferences.Add(matchedPair);
        }

        matchedPair.Mse = mse;
        matchedPair.Rmse = rmse;
        matchedPair.MaxAbs = maxAbs;

        await _applicationDbContext.SaveChangesAsync(context.CancellationToken);
    }

    private static alglib.rbfmodel Rbfmodel(MeasurementData measurementId1)
    {
        var points = new List<(double Va, double Vg, double Ia)>();
        foreach (var result in measurementId1.AnodeCurves.CurveSets)
        {
            foreach (var (va, ia) in result.V.Zip(result.I1, (va, ia) => (va, ia)))
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
        double rbase = Math.Max(vaRange, vgRange);


        var layers = 6;
        double lambda = 0.0;
        alglib.rbfcreate(2, 1, out var model);
        alglib.rbfsetpoints(model, xy);
        alglib.rbfsetalgomultilayer(model, rbase,layers, lambda);
        alglib.rbfbuildmodel(model, out _);
        return model;
    }

    static (double mse, double rmse, double maxAbs) SquaredDiffPointsInEllipse(
        alglib.rbfmodel m1, alglib.rbfmodel m2,
        double cx, double cy,   // центр
        double a, double b,     // полуоси
        int radialBands,        // колец по радиусу
        int pointsPerBand,      // точек на кольцо
        double phiRad = 0.0     // поворот (рад)
    )
    {
        double c = Math.Cos(phiRad), s = Math.Sin(phiRad);

        double sse = 0.0;     // sum of squared errors
        double maxAbs = 0.0;
        long count = 0;

        for (int i = 1; i <= radialBands; i++)
        {
            // midpoint по радиусу, чтобы не попадать на границы
            double r = (i - 0.5) / radialBands;

            for (int j = 0; j < pointsPerBand; j++)
            {
                double theta = 2 * Math.PI * j / pointsPerBand;

                // точка эллипса до поворота
                double ex = a * r * Math.Cos(theta);
                double ey = b * r * Math.Sin(theta);

                // поворот
                double rx = c * ex - s * ey;
                double ry = s * ex + c * ey;

                double va = cx + rx;
                double vg = cy + ry;

                double d = alglib.rbfcalc2(m1, va, vg) - alglib.rbfcalc2(m2, va, vg);
                double ad = Math.Abs(d);

                sse += d * d;
                if (ad > maxAbs) maxAbs = ad;
                count++;
            }
        }

        double mse = count > 0 ? sse / count : 0.0;
        double rmse = Math.Sqrt(mse);
        return (mse, rmse, maxAbs);
    }
}

public record CalculateMatchedPair(string MeasurementId1, string MeasurementId2);
