namespace Server.Application.New.Models;

/// <summary>
/// DTO-модель.
/// </summary>
public record TubeWorkingPointInfo(
    double AnodeVoltage,
    double GridVoltage,
    double AnodeVoltageHalfWidth,
    double GridVoltageHalfWidth,
    double NominalCurrent
);
