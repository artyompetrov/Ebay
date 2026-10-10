namespace Server.Domain.Measurements.Approximation;

/// <summary>
/// Рабочая точка лампы, относительно которой нормализуются анодные кривые при аппроксимации.
/// </summary>
/// <param name="AnodeVoltage">Анодное напряжение, В.</param>
/// <param name="GridVoltage">Напряжение на сетке, В.</param>
/// <param name="AnodeVoltageHalfWidth">Полуширина диапазона анодного напряжения, В.</param>
/// <param name="GridVoltageHalfWidth">Полуширина диапазона напряжения сетки, В.</param>
/// <param name="NominalCurrent">Номинальный ток, мА.</param>
public sealed record ApproximationWorkingPoint(
    double AnodeVoltage,
    double GridVoltage,
    double AnodeVoltageHalfWidth,
    double GridVoltageHalfWidth,
    double NominalCurrent);
