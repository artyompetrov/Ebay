using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт отрисовки SVG-изображений замеров для страницы лота eBay и внутренних страниц.
/// Получает уже подготовленные данные и только рисует, ничего не загружает.
/// </summary>
public interface IPlottingAdapter
{
    /// <summary>
    /// Рисует объединённое изображение замера: блок quick test (если есть), анодные и сеточные характеристики,
    /// а также предупреждение о недостаточном диапазоне тестера, если ни одна кривая не достигла Pmax.
    /// </summary>
    string RenderMeasurementPlot(MeasurementPlotRenderRequest request);

    /// <summary>
    /// Рисует заглушку с текстом статуса замера (например, "Sold").
    /// </summary>
    string RenderStatus(string status);

    /// <summary>
    /// Рисует карточку с состоянием лампы, кодом производителя и оценкой баланса секций.
    /// </summary>
    string RenderTubeInfo(TubeInfoRenderRequest request);
}
