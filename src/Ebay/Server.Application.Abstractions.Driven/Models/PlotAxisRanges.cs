namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Границы осей графиков замера.
/// </summary>
/// <param name="AnodeCurvesMinX">Минимум оси X анодных характеристик.</param>
/// <param name="AnodeCurvesMaxX">Максимум оси X анодных характеристик.</param>
/// <param name="AnodeCurvesMaxY">Максимум оси Y анодных характеристик (используется и для сеточных - для симметрии).</param>
/// <param name="GridCurvesMinX">Минимум оси X сеточных характеристик.</param>
/// <param name="GridCurvesMaxX">Максимум оси X сеточных характеристик.</param>
public sealed record PlotAxisRanges(
    double AnodeCurvesMinX,
    double AnodeCurvesMaxX,
    double AnodeCurvesMaxY,
    double GridCurvesMinX,
    double GridCurvesMaxX);
