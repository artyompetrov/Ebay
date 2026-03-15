using System.Linq.Expressions;
using Server.Domain.Measurements;

namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class ProductMeasurementView : IViewProjection<ProductMeasurement, ProductMeasurementView>
{
    public required string Id { get; set; }

    public required MeasurementState MeasurementState { get; set; }
    public required ProductState ProductState { get; set; }

    public required string ManufactureCode { get; set; }

    public required Guid ProductId { get; set; }

    public required DateTimeOffset CreatedAt { get; set; }

    public required string? Location { get; set; }

    public required string? MatchId { get; set; }

    public required string? LotId { get; set; }

    public required DateTimeOffset? LastTimeWatchedOnEbay { get; set; }

    public required byte[] Measurements { get; set; }

    public static Expression<Func<ProductMeasurement, ProductMeasurementView>> ToView => x =>
        new()
        {
            Id = x.Id,
            MeasurementState = x.MeasurementState,
            ProductState = x.ProductState,
            ManufactureCode = x.ManufactureCode,
            ProductId = x.ProductId,
            CreatedAt = x.CreatedAt,
            Location = x.Location,
            MatchId = x.MatchId,
            LotId = x.LotId,
            LastTimeWatchedOnEbay = x.LastTimeWatchedOnEbay,
            Measurements = x.Measurements
        };
}