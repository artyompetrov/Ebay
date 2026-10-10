using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Данные для отрисовки объединённого изображения замера.
/// </summary>
/// <param name="AnodeCurves">Анодные характеристики замера.</param>
/// <param name="GridCurves">Сеточные характеристики замера.</param>
/// <param name="AxisRanges">Границы осей, общие для замера и его подобранной пары.</param>
/// <param name="QuickTest">Значения в рабочей точке; <see langword="null" />, если блок quick test не нужен или рабочая точка не задана.</param>
/// <param name="Layout">Компоновка изображения.</param>
public sealed record MeasurementPlotRenderRequest(
    AnodeCurvesBase AnodeCurves,
    GridCurvesBase GridCurves,
    PlotAxisRanges AxisRanges,
    QuickTestValues? QuickTest,
    PlotLayout Layout);
