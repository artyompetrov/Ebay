namespace Server.Application.Services.Measurement.MeasurementTypes.Base;


public abstract class GridCurvesBase : GridOrScreenCurvesBase
{
    protected GridCurvesBase(
        double pmaxWatt,
        Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmaxWatt: pmaxWatt,
        measurementPoints: measurementPoints,
        variableSelector:  m => m.Vg)
    {
    }

    public override string CurveTitle => "Grid curves";


    public override string XLabel => "Vgrid (V)";
    
   
}