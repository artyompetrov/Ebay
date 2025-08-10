namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class ScreenCurvesBase : GridOrScreenCurvesBase
{
    protected ScreenCurvesBase(
        int pmax,
        Dictionary<int, MeasurementPoint[]> measurementPoints) : base(pmax, measurementPoints, m => m.Vs)
    {
    }

    public override string CurveTitle => "Screen curves";
    public override string XLabel => "Vscreen (V)";
}