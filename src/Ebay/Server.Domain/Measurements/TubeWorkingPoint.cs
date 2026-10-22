using OneOf;
using OneOf.Types;
using Server.Domain.Abstractions;
using Server.Domain.Errors;

namespace Server.Domain.Measurements;

public sealed class TubeWorkingPoint : AggregateRoot<Guid>
{
    private const double MinMagnitude = 0.01;

    private static readonly DomainError InvalidError = new($"{nameof(TubeWorkingPoint)} is not valid.");

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
    }

    public static OneOf<TubeWorkingPoint, DomainError> Create(
        Guid productId,
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent)
    {
        if (!IsValid(anodeVoltage, gridVoltage, anodeVoltageHalfWidth, gridVoltageHalfWidth, nominalCurrent))
        {
            return InvalidError;
        }

        return new TubeWorkingPoint(
            id: productId,
            anodeVoltage: anodeVoltage,
            gridVoltage: gridVoltage,
            anodeVoltageHalfWidth: anodeVoltageHalfWidth,
            gridVoltageHalfWidth: gridVoltageHalfWidth,
            nominalCurrent: nominalCurrent);
    }

    public OneOf<Success, DomainError> Update(
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent)
    {
        if (!IsValid(anodeVoltage, gridVoltage, anodeVoltageHalfWidth, gridVoltageHalfWidth, nominalCurrent))
        {
            return InvalidError;
        }

        AnodeVoltage = anodeVoltage;
        GridVoltage = gridVoltage;
        AnodeVoltageHalfWidth = anodeVoltageHalfWidth;
        GridVoltageHalfWidth = gridVoltageHalfWidth;
        NominalCurrent = nominalCurrent;

        return new Success();
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
    private static bool IsValid(
        double anodeVoltage,
        double gridVoltage,
        double anodeVoltageHalfWidth,
        double gridVoltageHalfWidth,
        double nominalCurrent) =>
        anodeVoltageHalfWidth >= MinMagnitude &&
        gridVoltageHalfWidth >= MinMagnitude &&
        nominalCurrent >= MinMagnitude &&
        anodeVoltage >= MinMagnitude &&
        gridVoltage <= -MinMagnitude;
}
