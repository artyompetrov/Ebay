using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries;

public record MeasurementInfoWithData(
    string Id,
    Guid ProductId,
    string? MatchId,
    string? LotId,
    string? Location,
    MeasurementState MeasurementState,
    ProductState ProductState,
    string ManufactureCode,
    DateTime? LastTimeWatchedOnEbay,
    byte[] Data) :
    MeasurementInfo(
        Id: Id,
        ProductId:
        ProductId,
        MatchId: MatchId,
        LotId: LotId,
        Location: Location,
        MeasurementState: MeasurementState,
        ProductState: ProductState,
        ManufactureCode: ManufactureCode,
        LastTimeWatchedOnEbay: LastTimeWatchedOnEbay);