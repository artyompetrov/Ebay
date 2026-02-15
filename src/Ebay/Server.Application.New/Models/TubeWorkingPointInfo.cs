namespace Server.Application.New.Models;

public record TubeWorkingPointInfo(
    double AnodeVoltage,
    double GridVoltage,
    double AnodeVoltageHalfWidth,
    double GridVoltageHalfWidth,
    double NominalCurrent
);
