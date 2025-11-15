using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries
{
    public record MeasurementInfoWithData(
        string Id,
        Guid ProductId,
        string? MatchId,
        string? LotId,
        MeasurementState MeasurementState,
        ProductState ProductState,
        string ManufactureCode,
        byte[] Data) : MeasurementInfo(Id: Id, ProductId: ProductId, MatchId: MatchId, LotId: LotId, MeasurementState: MeasurementState, ProductState: ProductState, ManufactureCode: ManufactureCode);
}