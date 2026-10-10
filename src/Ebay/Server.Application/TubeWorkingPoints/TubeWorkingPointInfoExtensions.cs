using Server.Application.Abstractions.Driven.Models;
using Server.Domain.Measurements.Approximation;

namespace Server.Application.TubeWorkingPoints;

internal static class TubeWorkingPointInfoExtensions
{
    public static ApproximationWorkingPoint ToApproximationWorkingPoint(this TubeWorkingPointInfo workingPoint) =>
        new(
            AnodeVoltage: workingPoint.AnodeVoltage,
            GridVoltage: workingPoint.GridVoltage,
            AnodeVoltageHalfWidth: workingPoint.AnodeVoltageHalfWidth,
            GridVoltageHalfWidth: workingPoint.GridVoltageHalfWidth,
            NominalCurrent: workingPoint.NominalCurrent);
}
