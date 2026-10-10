namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Значения замера в рабочей точке лампы.
/// </summary>
/// <param name="Ua">Анодное напряжение рабочей точки, В.</param>
/// <param name="Ug">Напряжение сетки рабочей точки, В.</param>
/// <param name="Ia">Анодный ток (первая секция), мА.</param>
/// <param name="Ia2">Анодный ток второй секции, мА; <see langword="null" /> для одиночной лампы.</param>
/// <param name="Transconductance">Крутизна (первая секция), мА/В.</param>
/// <param name="Transconductance2">Крутизна второй секции, мА/В; <see langword="null" /> для одиночной лампы.</param>
public sealed record QuickTestValues(
    double Ua,
    double Ug,
    double Ia,
    double? Ia2,
    double Transconductance,
    double? Transconductance2);
