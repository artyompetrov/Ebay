using Server.Domain.Measurements;

namespace Server.Application.Abstractions.Measurements;

public record MeasurementInfoWithData(
    string Id,
    Guid ProductId,
    ProductState ProductState,
    string ManufactureCode,
    string ProductName,
    byte[] Data) : MeasurementInfo(Id: Id, ProductId: ProductId, ProductState: ProductState, ManufactureCode: ManufactureCode, ProductName: ProductName);
