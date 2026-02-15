using Server.Domain.Exceptions;

namespace Server.Domain.Measurements;

/// <summary>
/// класс доменной модели.
/// </summary>
public sealed class TubeWorkingPoint : AggregateRoot<Guid>
{
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

    /// <summary>
    /// элемент.
    /// </summary>
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

    /// <summary>
    /// элемент.
    /// </summary>
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


    /// <summary>
    /// свойство.
    /// </summary>
    public double AnodeVoltage { get; private set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public double GridVoltage { get; private set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public double AnodeVoltageHalfWidth { get; private set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public double GridVoltageHalfWidth { get; private set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public double NominalCurrent { get; private set; }


    /// <summary>
    /// Проверяет корректность рабочей точки:
    /// - Полуширины напряжений должны быть > 1.0
    /// - Номинальный ток должен быть > 1.0
    /// </summary>
    private bool IsValid =>
        AnodeVoltageHalfWidth > 1.0 &&
        GridVoltageHalfWidth > 0.5 &&
        NominalCurrent > 1.0 &&
        AnodeVoltage > 1.0 &&
        GridVoltage < -1.0;
}
