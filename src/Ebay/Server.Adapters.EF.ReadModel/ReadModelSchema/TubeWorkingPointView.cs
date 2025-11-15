using System.Linq.Expressions;
using Server.Domain.Measurements;

namespace Sever.Adapters.EF.ReadModel.ReadModelSchema
{

    internal sealed class TubeWorkingPointView : IViewProjection<TubeWorkingPoint, TubeWorkingPointView>
    {
        public required Guid Id { get; set; }

        public ProductView Product { get; set; } = null!;

        public required double AnodeVoltage { get; set; }


        public required double GridVoltage { get; set; }


        public required double AnodeVoltageHalfWidth { get; set; }


        public required double GridVoltageHalfWidth { get; set; }


        public required double NominalCurrent { get; set; }

        public static Expression<Func<TubeWorkingPoint, TubeWorkingPointView>> ToView => x =>
            new TubeWorkingPointView
            {
                Id = x.Id,
                AnodeVoltage = x.AnodeVoltage,
                GridVoltage = x.GridVoltage,
                AnodeVoltageHalfWidth = x.AnodeVoltageHalfWidth,
                GridVoltageHalfWidth = x.GridVoltageHalfWidth,
                NominalCurrent = x.NominalCurrent
            };
    }
}