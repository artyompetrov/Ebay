namespace Server.Application.Services.Measurement.MeasurementTypes.Base;


public abstract class GridCurvesBase : GridOrScreenCurvesBase
{
    protected GridCurvesBase(
        int pmax,
        Dictionary<int, MeasurementPoint[]> measurementPoints) : base(
        pmax: pmax,
        measurementPoints: measurementPoints,
        variableSelector:  m => m.Vg)
    {
    }

    public override string CurveTitle => "Grid curves";


    public override string XLabel => "Vgrid (V)";
    
   
}