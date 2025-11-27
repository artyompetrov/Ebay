namespace Server.Application.Abstractions.Queries;

public record TubeWorkingPointInfo(
    double AnodeVoltage,
    double GridVoltage,
    double AnodeVoltageHalfWidth,
    double GridVoltageHalfWidth,
    double NominalCurrent
);