using System.Diagnostics;
using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Measurements;
using Server.Application.Data;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Application.Consumers.MatchedPairs;

internal class MatchedPairsCalculator : IConsumer<CalculateMatchedPair>
{
    private readonly ILogger<MatchedPairsCalculator> _logger;
    private readonly ApplicationDbContext _applicationDbContext;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;

    public MatchedPairsCalculator(
        ILogger<MatchedPairsCalculator> logger,
        ApplicationDbContext applicationDbContext,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser
        )
    {
        _logger = logger;
        _applicationDbContext = applicationDbContext;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
    }

    private record MeasurementInfoWithAnodeCurves(MeasurementInfoWithData MeasurementInfoWithData, AnodeCurvesBase AnodeCurves);

    public async Task Consume(ConsumeContext<CalculateMatchedPair> context)
    {
        _logger.LogInformation(
            message: "Processing {MeasurementId1} {MeasurementId2} in {ServiceName}",
            context.Message.MeasurementId1,
            context.Message.MeasurementId2,
            nameof(CalculateMatchedPair));

        var measurement1dto = await _measurementQueries.GetMeasurementInfoWithData(context.Message.MeasurementId1, context.CancellationToken);
        var measurement2dto = await _measurementQueries.GetMeasurementInfoWithData(context.Message.MeasurementId2, context.CancellationToken);

        if (measurement1dto == null || measurement2dto == null)
        {
            return;
        }

        // Сравниваем только новые с новыми и б/у с б/у
        if (measurement1dto.ProductState != measurement2dto.ProductState)
        {
            return;
        }

        var radialBands = 10;
        var pointsPerBand = 36;

        var workingPoint = await _applicationDbContext.TubeWorkingPoints
            .AsNoTracking()
            .SingleOrDefaultAsync(
                x => x.ProductId == measurement1dto.ProductId,
                cancellationToken: context.CancellationToken);

        if (workingPoint == null)
        {
            _logger.LogError(
                message: "Tube working point not found for product {ProductId}",
                measurement1dto.ProductId);
            return;
        }

        if (!workingPoint.IsValid)
        {
            _logger.LogError(message: "Tube working point is not valid");
            return;
        }


        var measurement1 = new MeasurementInfoWithAnodeCurves(
            measurement1dto,
            AnodeCurves: _measurementFileParser.Parse(measurement1dto.Data).MeasurementConfigTableParseResult.AnodeCurves);

        var measurement2 = new MeasurementInfoWithAnodeCurves(
            measurement2dto,
            AnodeCurves: _measurementFileParser.Parse(measurement1dto.Data).MeasurementConfigTableParseResult.AnodeCurves);

        switch (measurement1.AnodeCurves)
        {
            case PentodeAnodeCurves:
            {
                if (measurement2.AnodeCurves is not PentodeAnodeCurves)
                {
                    throw new UnreachableException($"{nameof(measurement2)} is expected to be PentodeAnodeCurves");

                }

                if (measurement1 == measurement2)
                {
                    // игнорируем сравнение сами собой
                    return;
                }

                await CalculateForOneSectionTubes(
                    measurement1: measurement1,
                    measurement2: measurement2,
                    cancellationToken: context.CancellationToken,
                    workingPoint: workingPoint,
                    radialBands: radialBands,
                    pointsPerBand: pointsPerBand);
            }
            break;

            case TriodeAnodeCurves:
            {
                if (measurement2.AnodeCurves is not TriodeAnodeCurves)
                {
                    throw new UnreachableException($"{nameof(measurement2)} is expected to be TriodeAnodeCurves");
                }

                if (measurement1.MeasurementInfoWithData.Id == measurement2.MeasurementInfoWithData.Id)
                {
                    // игнорируем сравнение сами собой
                    return;
                }

                await CalculateForOneSectionTubes(
                    measurement1: measurement1,
                    measurement2: measurement2,
                    cancellationToken: context.CancellationToken,
                    workingPoint: workingPoint,
                    radialBands: radialBands,
                    pointsPerBand: pointsPerBand);
            }
            break;

            case DoubleTriodeAnodeCurves:
            {
                if (measurement2.AnodeCurves is not DoubleTriodeAnodeCurves)
                {
                    throw new UnreachableException($"{nameof(measurement2)} is expected to be DoubleTriodeAnodeCurves");
                }

                await CalculateForTwoSectionTubes(
                    measurement1: measurement1,
                    measurement2: measurement2,
                    cancellationToken: context.CancellationToken,
                    workingPoint: workingPoint,
                    radialBands: radialBands,
                    pointsPerBand: pointsPerBand);
            }
            break;
            default:
                throw new NotSupportedException($"Unsupported subtype of {nameof(MeasurementTypeBase)}");
        }
    }

    private async Task CalculateForTwoSectionTubes(
        MeasurementInfoWithAnodeCurves measurement1,
        MeasurementInfoWithAnodeCurves measurement2,
        CancellationToken cancellationToken,
        TubeWorkingPoint workingPoint,
        int radialBands, int pointsPerBand)
    {
        var measurement1I1 = GetPoints(measurement1.AnodeCurves, x => x.I1);
        var measurement2I1 = GetPoints(measurement2.AnodeCurves, x => x.I1);
        var measurement1I1Model = RbfModel(measurement1I1, workingPoint);
        var measurement2I1Model = RbfModel(measurement2I1, workingPoint);

        var measurement1I2 = GetPoints(
             measurement1.AnodeCurves,
            x => x.I2 ?? throw new NullReferenceException("I2 is expected to be not null"));
        var measurement2I2 = GetPoints(
            measurement2.AnodeCurves,
            x => x.I2 ?? throw new NullReferenceException("I2 is expected to be not null"));
        var measurement1I2Model = RbfModel(measurement1I2, workingPoint);
        var measurement2I2Model = RbfModel(measurement2I2, workingPoint);

        if (measurement1.MeasurementInfoWithData.Id != measurement2.MeasurementInfoWithData.Id) // не делаем Direct в кейсе когда мы сравниваем две секции двойного триода между собой
        {
            var (mseDirect1, rmseDirect1, maxAbsDirect1) = SquaredDiffPointsInEllipse(
                model1: measurement1I1Model,
                model2: measurement2I1Model,
                radialBands: radialBands,
                pointsPerBand: pointsPerBand,
                workingPoint: workingPoint);

            var (mseDirect2, rmseDirect2, maxAbsDirect2) = SquaredDiffPointsInEllipse(
                model1: measurement1I2Model,
                model2: measurement2I2Model,
                radialBands: radialBands,
                pointsPerBand: pointsPerBand,
                workingPoint: workingPoint);

            await SaveToDatabase(
                measurementId1: measurement1.MeasurementInfoWithData.Id,
                measurementId2: measurement2.MeasurementInfoWithData.Id,
                cancellationToken: cancellationToken,
                comparisonMode: ComparisonMode.Direct,
                mseSection1: mseDirect1,
                rmseSection1: rmseDirect1,
                maxAbsSection1: maxAbsDirect1,
                mseSection2: mseDirect2,
                rmseSection2: rmseDirect2,
                maxAbsSection2: maxAbsDirect2);
        }

        var (mseCross1, rmseCross1, maxAbsCross1) = SquaredDiffPointsInEllipse(
            model1: measurement1I1Model,
            model2: measurement2I2Model,
            radialBands: radialBands,
            pointsPerBand: pointsPerBand,
            workingPoint: workingPoint);

        var (mseCross2, rmseCross2, maxAbsCross2) = SquaredDiffPointsInEllipse(
            model1: measurement1I2Model,
            model2: measurement2I1Model,
            radialBands: radialBands,
            pointsPerBand: pointsPerBand,
            workingPoint: workingPoint);

        await SaveToDatabase(
            measurementId1: measurement1.MeasurementInfoWithData.Id,
            measurementId2: measurement2.MeasurementInfoWithData.Id,
            cancellationToken: cancellationToken,
            comparisonMode: ComparisonMode.Cross,
            mseSection1: mseCross1,
            rmseSection1: rmseCross1,
            maxAbsSection1: maxAbsCross1,
            mseSection2: mseCross2,
            rmseSection2: rmseCross2,
            maxAbsSection2: maxAbsCross2);
    }

    private async Task CalculateForOneSectionTubes(
        MeasurementInfoWithAnodeCurves measurement1,
        MeasurementInfoWithAnodeCurves measurement2,
        CancellationToken cancellationToken,
        TubeWorkingPoint workingPoint,
        int radialBands,
        int pointsPerBand)
    {
        var measurement1I1 = GetPoints(measurement1.AnodeCurves, x => x.I1);
        var measurement2I1 = GetPoints(measurement2.AnodeCurves, x => x.I1);

        var measurement1I1Model = RbfModel(measurement1I1, workingPoint);
        var measurement2I1Model = RbfModel(measurement2I1, workingPoint);

        var (mse, rmse, maxAbs) = SquaredDiffPointsInEllipse(
            model1: measurement1I1Model,
            model2: measurement2I1Model,
            radialBands: radialBands,
            pointsPerBand: pointsPerBand,
            workingPoint: workingPoint
            );

        await SaveToDatabase(
            measurementId1: measurement1.MeasurementInfoWithData.Id,
            measurementId2: measurement2.MeasurementInfoWithData.Id,
            cancellationToken: cancellationToken,
            comparisonMode: ComparisonMode.Direct,
            mseSection1: mse,
            rmseSection1: rmse,
            maxAbsSection1: maxAbs
            );
    }

    private async Task SaveToDatabase(
        string measurementId1,
        string measurementId2,
        CancellationToken cancellationToken,
        ComparisonMode comparisonMode,
        double mseSection1,
        double rmseSection1,
        double maxAbsSection1,
        double? mseSection2 = null,
        double? rmseSection2 = null,
        double? maxAbsSection2 = null)
    {
        var pairDifference = await _applicationDbContext.MatchedPairDifferences
            .SingleOrDefaultAsync(
                x => x.Measurement1Id == measurementId1 &&
                     x.Measurement2Id == measurementId2 &&
                     x.ComparisonMode == comparisonMode,
                cancellationToken: cancellationToken);

        if (pairDifference == null)
        {
            pairDifference = new MatchedPairDifference
            {
                Measurement1Id = measurementId1,
                Measurement2Id = measurementId2,
                ComparisonMode = comparisonMode
            };

            _applicationDbContext.MatchedPairDifferences.Add(pairDifference);
        }

        pairDifference.MseSection1 = mseSection1;
        pairDifference.RmseSection1 = rmseSection1;
        pairDifference.MaxAbsSection1 = maxAbsSection1;
        pairDifference.MseSection2 = mseSection2;
        pairDifference.RmseSection2 = rmseSection2;
        pairDifference.MaxAbsSection2 = maxAbsSection2;

        await _applicationDbContext.SaveChangesAsync(cancellationToken);
    }

    private static List<MeasurementPoint> GetPoints(AnodeCurvesBase anodeCurves, Func<CurveSet, IReadOnlyCollection<double>> iExtractor)
    {
        var points = new List<MeasurementPoint>();
        foreach (var result in anodeCurves.CurveSets)
        {
            foreach (var (va, ia) in result.V.Zip(second: iExtractor(result), (va, ia) => (va, ia)))
            {
                points.Add(new(
                    Va: va,
                    Vg: result.VSteppingValue,
                    Ia: ia));
            }

        }

        return points;
    }

    private record struct MeasurementPoint(double Va, double Vg, double Ia);

    /// <summary>
    /// Функция создает модель при помощи RBF интерполяции
    /// </summary>
    private alglib.rbfmodel RbfModel(List<MeasurementPoint> points, TubeWorkingPoint wp)
    {
        var baseX = Math.Max(1e-9, wp.AnodeVoltageHalfWidth);
        var baseY = Math.Max(1e-9, wp.GridVoltageHalfWidth);
        var baseZ = Math.Max(1e-9, wp.NominalCurrent);

        var xy = new double[points.Count, 3];
        for (var i = 0; i < points.Count; i++)
        {
            // нормализация относительно рабочей точки и полуосей эллипса
            xy[i, 0] = (points[i].Va - wp.AnodeVoltage) / baseX;
            xy[i, 1] = (points[i].Vg - wp.GridVoltage) / baseY;
            xy[i, 2] = (points[i].Ia / baseZ) * 100.0; // нормализуем и приводим к процентам
        }

        alglib.rbfcreate(2, 1, out var model);
        alglib.rbfsetpoints(model, xy);
        alglib.rbfsetalgomultilayer(model, rbase: 1.0, nlayers: 6, lambdav: 1e-5);
        alglib.rbfbuildmodel(model, out _);
        return model;
    }

    /// <summary>
    /// Функция считает ошибку между двумя интерполированными плоскостями
    /// </summary>
    /// <param name="model1">Модель 1</param>
    /// <param name="model2">Модель 2</param>
    /// <param name="radialBands">Количество эллипсов вокруг рабочей точки</param>
    /// <param name="pointsPerBand">Количество точек на эллипсе</param>
    /// <param name="workingPoint">Рабочая точка</param>
    /// <param name="phiRad">Поворот эллипса</param>
    /// <returns></returns>
    static (double mse, double rmse, double maxAbs) SquaredDiffPointsInEllipse(
        alglib.rbfmodel model1,
        alglib.rbfmodel model2,
        int radialBands,        // колец по радиусу
        int pointsPerBand,      // точек на кольцо
        TubeWorkingPoint workingPoint,
        double phiRad = 0.0     // поворот (рад)
    )
    {
        var c = Math.Cos(phiRad);
        var s = Math.Sin(phiRad);

        var sse = 0.0;     // sum of squared errors
        var maxAbs = 0.0;
        long count = 0;

        var anodeBase = Math.Max(1e-9, workingPoint.AnodeVoltageHalfWidth);
        var gridBase = Math.Max(1e-9, workingPoint.GridVoltageHalfWidth);

        for (var i = 1; i <= radialBands; i++)
        {
            // midpoint по радиусу, чтобы не попадать на границы
            var r = (i - 0.5) / radialBands;

            for (var j = 0; j < pointsPerBand; j++)
            {
                var theta = 2 * Math.PI * j / pointsPerBand;

                // точка эллипса до поворота
                var ex = workingPoint.AnodeVoltageHalfWidth * r * Math.Cos(theta);
                var ey = workingPoint.GridVoltageHalfWidth * r * Math.Sin(theta);

                // поворот
                var rx = c * ex - s * ey;
                var ry = s * ex + c * ey;

                var x = rx / anodeBase; // Делим для нормализации
                var y = ry / gridBase; // Делим для нормализации

                var d = alglib.rbfcalc2(s: model1, x0: x, x1: y) - alglib.rbfcalc2(s: model2, x0: x, x1: y);
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

public record CalculateMatchedPair(string MeasurementId1, string MeasurementId2)
{
    public override string ToString() => $"{MeasurementId1}-{MeasurementId2}";
}