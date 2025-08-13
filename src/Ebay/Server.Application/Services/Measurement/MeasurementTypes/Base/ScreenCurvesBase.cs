namespace Server.Application.Services.Measurement.MeasurementTypes.Base;

public abstract class ScreenCurvesBase : GridOrScreenCurvesBase
{
    protected ScreenCurvesBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints) :
        base(pmaxWatt, measurementPoints, m => m.Vs)
    {
    }

    public override string CurveTitle => "Screen curves";
    public override string XLabel => "Vscreen (V)";
}