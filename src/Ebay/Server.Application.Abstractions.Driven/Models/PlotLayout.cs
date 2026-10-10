namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Компоновка изображения замера.
/// </summary>
/// <param name="MergeVertical">Располагать графики друг под другом, а не рядом.</param>
/// <param name="LegendVertical">Располагать легенду справа, а не снизу.</param>
/// <param name="Width">Ширина одного графика, px.</param>
/// <param name="Height">Высота одного графика, px.</param>
public sealed record PlotLayout(bool MergeVertical, bool LegendVertical, int Width, int Height);
