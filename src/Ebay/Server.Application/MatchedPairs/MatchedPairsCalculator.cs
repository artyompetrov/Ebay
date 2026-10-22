using System.Diagnostics.CodeAnalysis;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Application.Abstractions.Driven.Models;
using Server.Application.Abstractions.Driving.Abstractions.Services;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;
using Server.Application.TubeWorkingPoints;
using Server.Domain.Measurements.Approximation;

namespace Server.Application.MatchedPairs;

internal sealed class MatchedPairsCalculator : IMatchedPairsCalculator
{
    private readonly ILogger<MatchedPairsCalculator> _logger;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;
    private readonly IMatchedPairDifferenceRepository _matchedPairDifferenceRepository;
    private readonly ITubeWorkingPointQueries _tubeWorkingPointQueries;
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;

    public MatchedPairsCalculator(
        ILogger<MatchedPairsCalculator> logger,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser,
        IMatchedPairDifferenceRepository matchedPairDifferenceRepository,
        ITubeWorkingPointQueries tubeWorkingPointQueries,
        IWriteModelUnitOfWorkFactory unitOfWorkFactory)
    {
        _logger = logger;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
        _matchedPairDifferenceRepository = matchedPairDifferenceRepository;
        _tubeWorkingPointQueries = tubeWorkingPointQueries;
        _unitOfWorkFactory = unitOfWorkFactory;
    }

    private sealed record MeasurementInfoWithAnodeCurves(MeasurementInfoWithData MeasurementInfoWithData, AnodeCurvesBase AnodeCurves);

    public async Task CalculateAsync(string measurementId1, string measurementId2, CancellationToken cancellationToken)
    {
        _logger.LogInformation(
            "Processing {MeasurementId1} {MeasurementId2} in {ServiceName}",
            measurementId1,
            measurementId2,
            nameof(IMatchedPairsCalculator));

        var measurement1dto = await _measurementQueries.GetMeasurementInfoWithData(measurementId1, cancellationToken);
        var measurement2dto = await _measurementQueries.GetMeasurementInfoWithData(measurementId2, cancellationToken);

        if (measurement1dto == null || measurement2dto == null)
        {
            return;
        }

        if (measurement1dto.MeasurementState == MeasurementState.Sold || measurement2dto.MeasurementState == MeasurementState.Sold)
        {
            _logger.LogInformation(
                message: "Measurement pair skipped {MeasurementId1} {MeasurementId2} because one of them is sold",
                measurementId1,
                measurementId2
            );

            return;
        }

        // Сравниваем только новые с новыми и б/у с б/у
        if (measurement1dto.ProductState != measurement2dto.ProductState)
        {
            return;
        }

        if (measurement1dto.ProductId != measurement2dto.ProductId)
        {
            _logger.LogError(
                message: "Trying to compare different product measurements {MeasurementId1} {MeasurementId2} ProductIds {ProductId1}, {ProductId2}",
                measurementId1,
                measurementId2,
                measurement1dto.ProductId,
                measurement2dto.ProductId
                );
            return;
        }

        var radialBands = 10;
        var pointsPerBand = 36;

        var workingPoint =
            await _tubeWorkingPointQueries.GetWorkingPointInfo(measurement1dto.ProductId, cancellationToken);

        if (workingPoint == null)
        {
            _logger.LogError(
                message: "Tube working point not found for product {ProductId}",
                measurement1dto.ProductId);
            return;
        }

        if (!TryParse(measurement1dto, out var measurement1) || !TryParse(measurement2dto, out var measurement2))
        {
            return;
        }

        if (measurement1.AnodeCurves.GetType() != measurement2.AnodeCurves.GetType())
        {
            // Measurements of one product are always taken with the same tube type.
            _logger.LogError(
                message: "Measurements {MeasurementId1} {MeasurementId2} have different anode curve types {AnodeCurvesType1}, {AnodeCurvesType2}",
                measurementId1,
                measurementId2,
                measurement1.AnodeCurves.GetType().Name,
                measurement2.AnodeCurves.GetType().Name);
            return;
        }

        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        switch (measurement1.AnodeCurves)
        {
            case PentodeAnodeCurves:
                {
                    if (measurement1 == measurement2)
                    {
                        // игнорируем сравнение сами собой
                        return;
                    }

                    await CalculateForOneSectionTubes(
                        unitOfWork: unitOfWork,
                        measurement1: measurement1,
                        measurement2: measurement2,
                        cancellationToken: cancellationToken,
                        workingPoint: workingPoint,
                        radialBands: radialBands,
                        pointsPerBand: pointsPerBand);
                }

                break;

            case TriodeAnodeCurves:
                {
                    if (measurement1.MeasurementInfoWithData.Id == measurement2.MeasurementInfoWithData.Id)
                    {
                        // игнорируем сравнение сами собой
                        return;
                    }

                    await CalculateForOneSectionTubes(
                        unitOfWork: unitOfWork,
                        measurement1: measurement1,
                        measurement2: measurement2,
                        cancellationToken: cancellationToken,
                        workingPoint: workingPoint,
                        radialBands: radialBands,
                        pointsPerBand: pointsPerBand);
                }

                break;

            case DoubleTriodeAnodeCurves:
                {
                    await CalculateForTwoSectionTubes(
                        unitOfWork: unitOfWork,
                        measurement1: measurement1,
                        measurement2: measurement2,
                        cancellationToken: cancellationToken,
                        workingPoint: workingPoint,
                        radialBands: radialBands,
                        pointsPerBand: pointsPerBand);
                }

                break;
            default:
                _logger.LogError(
                    message: "Unsupported anode curves type {AnodeCurvesType} of {MeasurementId1}",
                    measurement1.AnodeCurves.GetType().Name,
                    measurementId1);
                break;
        }
    }

    private bool TryParse(
        MeasurementInfoWithData measurement,
        [NotNullWhen(true)] out MeasurementInfoWithAnodeCurves? parsed)
    {
        var parseResult = _measurementFileParser.Parse(measurement.Data);
        if (parseResult.TryPickT1(out var error, out var parsedFile))
        {
            _logger.LogError(
                message: "Measurement {MeasurementId} file cannot be parsed: {Error}",
                measurement.Id,
                error.Message);
            parsed = null;
            return false;
        }

        parsed = new MeasurementInfoWithAnodeCurves(measurement, parsedFile.MeasurementConfigTableParseResult.AnodeCurves);
        return true;
    }

    private async Task CalculateForTwoSectionTubes(
        IWriteModelUnitOfWork unitOfWork,
        MeasurementInfoWithAnodeCurves measurement1,
        MeasurementInfoWithAnodeCurves measurement2,
        TubeWorkingPointInfo workingPoint,
        int radialBands,
        int pointsPerBand,
        CancellationToken cancellationToken)
    {
        var approximationWorkingPoint = workingPoint.ToApproximationWorkingPoint();
        var measurement1I1Model = AnodeCurveModelBuilder.Build(measurement1.AnodeCurves, x => x.I1, approximationWorkingPoint);
        var measurement2I1Model = AnodeCurveModelBuilder.Build(measurement2.AnodeCurves, x => x.I1, approximationWorkingPoint);

        // Two-section (double triode) curves always carry the second section's current I2 (HasSecondCurve).
        var measurement1I2Model = AnodeCurveModelBuilder.Build(measurement1.AnodeCurves, static x => x.I2!, approximationWorkingPoint);
        var measurement2I2Model = AnodeCurveModelBuilder.Build(measurement2.AnodeCurves, static x => x.I2!, approximationWorkingPoint);

        if (measurement1.MeasurementInfoWithData.Id != measurement2.MeasurementInfoWithData.Id)
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
                unitOfWork: unitOfWork,
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
            unitOfWork: unitOfWork,
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
        IWriteModelUnitOfWork unitOfWork,
        MeasurementInfoWithAnodeCurves measurement1,
        MeasurementInfoWithAnodeCurves measurement2,
        TubeWorkingPointInfo workingPoint,
        int radialBands,
        int pointsPerBand,
        CancellationToken cancellationToken)
    {
        var approximationWorkingPoint = workingPoint.ToApproximationWorkingPoint();
        var measurement1I1Model = AnodeCurveModelBuilder.Build(measurement1.AnodeCurves, x => x.I1, approximationWorkingPoint);
        var measurement2I1Model = AnodeCurveModelBuilder.Build(measurement2.AnodeCurves, x => x.I1, approximationWorkingPoint);

        var (mse, rmse, maxAbs) = SquaredDiffPointsInEllipse(
            model1: measurement1I1Model,
            model2: measurement2I1Model,
            radialBands: radialBands,
            pointsPerBand: pointsPerBand,
            workingPoint: workingPoint
        );

        await SaveToDatabase(
            unitOfWork: unitOfWork,
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
        IWriteModelUnitOfWork unitOfWork,
        string measurementId1,
        string measurementId2,
        ComparisonMode comparisonMode,
        double mseSection1,
        double rmseSection1,
        double maxAbsSection1,
        CancellationToken cancellationToken,
        double? mseSection2 = null,
        double? rmseSection2 = null,
        double? maxAbsSection2 = null)
    {
        var newMatchedPairDifference = MatchedPairDifference.Create(
            id: new MatchedPairDifferenceId(measurementId1, measurementId2, comparisonMode),
            comparisonMode: comparisonMode,
            mseSection1: mseSection1,
            mseSection2: mseSection2,
            rmseSection1: rmseSection1,
            rmseSection2: rmseSection2,
            maxAbsSection1: maxAbsSection1,
            maxAbsSection2: maxAbsSection2);

        await _matchedPairDifferenceRepository.RemoveAsync(
            unitOfWork,
            newMatchedPairDifference.Id,
            cancellationToken);

        await _matchedPairDifferenceRepository.AddAsync(
            unitOfWork,
            newMatchedPairDifference,
            cancellationToken);

        await unitOfWork.SaveChangesAsync(cancellationToken);
    }

    /// <summary>
    /// Функция считает ошибку между двумя интерполированными плоскостями.
    /// </summary>
    /// <param name="model1">Модель 1.</param>
    /// <param name="model2">Модель 2.</param>
    /// <param name="radialBands">Количество эллипсов вокруг рабочей точки.</param>
    /// <param name="pointsPerBand">Количество точек на эллипсе.</param>
    /// <param name="workingPoint">Рабочая точка.</param>
    /// <param name="phiRad">Поворот эллипса.</param>
    /// <returns>Среднеквадратичная, корневая и максимальная абсолютная ошибка.</returns>
    private static (double mse, double rmse, double maxAbs) SquaredDiffPointsInEllipse(
        AnodeCurveModel model1,
        AnodeCurveModel model2,
        int radialBands,
        int pointsPerBand,
        TubeWorkingPointInfo workingPoint,
        double phiRad = 0.0)
    {
        var c = Math.Cos(phiRad);
        var s = Math.Sin(phiRad);

        var sse = 0.0;
        var maxAbs = 0.0;
        long count = 0;

        var anodeBase = Math.Max(1e-9, workingPoint.AnodeVoltageHalfWidth);
        var gridBase = Math.Max(1e-9, workingPoint.GridVoltageHalfWidth);

        for (var i = 1; i <= radialBands; i++)
        {
            var r = (i - 0.5) / radialBands;

            for (var j = 0; j < pointsPerBand; j++)
            {
                var theta = 2 * Math.PI * j / pointsPerBand;

                var ex = workingPoint.AnodeVoltageHalfWidth * r * Math.Cos(theta);
                var ey = workingPoint.GridVoltageHalfWidth * r * Math.Sin(theta);

                var rx = c * ex - s * ey;
                var ry = s * ex + c * ey;

                var x = rx / anodeBase;
                var y = ry / gridBase;

                var d = model1.ApproximateRelative(x, y) - model2.ApproximateRelative(x, y);
                var ad = Math.Abs(d);

                sse += d * d;
                if (ad > maxAbs)
                {
                    maxAbs = ad;
                }

                count++;
            }
        }

        var mse = count > 0 ? sse / count : 0.0;
        var rmse = Math.Sqrt(mse);
        return (mse, rmse, maxAbs);
    }
}