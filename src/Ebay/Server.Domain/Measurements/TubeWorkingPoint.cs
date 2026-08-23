using Server.Domain.Abstractions;
using Server.Domain.Exceptions;

namespace Server.Domain.Measurements;

public sealed class TubeWorkingPoint : AggregateRoot<Guid>
{
    private const double MinMagnitude = 0.01;

    private TubeWorkingPoint(
        Guid id,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent) : base(id: id)
    {
        AnodeVoltage = anodeVoltage;
        GridVoltage = gridVoltage;
        AnodeVoltageHalfWidth = anodeVoltageHalfWidth;
        GridVoltageHalfWidth = gridVoltageHalfWidth;
        NominalCurrent = nominalCurrent;

        if (!IsValid)
        {
            throw new DomainException($"{nameof(TubeWorkingPoint)} is not valid.");
        }
    }

    public static TubeWorkingPoint Create(
        Guid productId,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent)
    {
        return new(
            id: productId,
            anodeVoltage: anodeVoltage,
            gridVoltage: gridVoltage,
            anodeVoltageHalfWidth: anodeVoltageHalfWidth,
            gridVoltageHalfWidth: gridVoltageHalfWidth,
            nominalCurrent: nominalCurrent);
    }

    public void Update(
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent)
    {

        AnodeVoltage = anodeVoltage;
        GridVoltage = gridVoltage;
        AnodeVoltageHalfWidth = anodeVoltageHalfWidth;
        GridVoltageHalfWidth = gridVoltageHalfWidth;
        NominalCurrent = nominalCurrent;

        if (!IsValid)
        {
            throw new DomainException($"{nameof(TubeWorkingPoint)} is not valid.");
        }
    }

    public double AnodeVoltage { get; private set; }

    public double GridVoltage { get; private set; }

    public double AnodeVoltageHalfWidth { get; private set; }

    public double GridVoltageHalfWidth { get; private set; }

    public double NominalCurrent { get; private set; }

    /// <summary>
    /// Проверяет корректность рабочей точки:
    /// - Все положительные значения должны быть не меньше 0.01
    /// - Напряжение сетки должно быть не больше -0.01
    /// </summary>
    private bool IsValid =>
        AnodeVoltageHalfWidth >= MinMagnitude &&
        GridVoltageHalfWidth >= MinMagnitude &&
        NominalCurrent >= MinMagnitude &&
        AnodeVoltage >= MinMagnitude &&
        GridVoltage <= -MinMagnitude;
}