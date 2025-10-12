using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Queries;

public record MeasurementInfoWithData(
    string Id,
    Guid ProductId,
    MeasurementState MeasurementState,
    ProductState ProductState,
    string ManufactureCode,
    byte[] Data) : MeasurementInfo(Id: Id, ProductId: ProductId, ProductState: ProductState, ManufactureCode: ManufactureCode, MatchId: null);