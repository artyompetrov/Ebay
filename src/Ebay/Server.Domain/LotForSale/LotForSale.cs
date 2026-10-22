using OneOf;
using OneOf.Types;
using Server.Domain.Abstractions;
using Server.Domain.Errors;
using Server.Domain.Measurements;

namespace Server.Domain.LotForSale;

public sealed class LotForSale : AggregateRoot<string>
{
    private const int IdLength = 7;

    private LotForSale(string id, string name, Guid productId, ProductState productState, MeasurementState measurementState) : base(id)
    {
        Name = name;
        ProductId = productId;
        ProductState = productState;
        MeasurementState = measurementState;
    }

    public string Name { get; private set; }

    public Guid ProductId { get; private set; }

    public ProductState ProductState { get; private set; }

    public MeasurementState MeasurementState { get; private set; }

    public static OneOf<LotForSale, DomainError> Create(string id, string name, Guid productId, ProductState productState, MeasurementState measurementState)
    {
        if (string.IsNullOrWhiteSpace(id) || id.Length != IdLength)
        {
            return new DomainError($"LotForSale Id must contain exactly {IdLength} symbols.");
        }

        if (ValidateName(name) is { } nameError)
        {
            return nameError;
        }

        if (productId == Guid.Empty)
        {
            return new DomainError("ProductId is required.");
        }

        if (measurementState == MeasurementState.Sold)
        {
            return new DomainError("Sold measurement state is not allowed for lot-for-sale creation.");
        }

        return new LotForSale(
            id: id,
            name: name.Trim(),
            productId: productId,
            productState: productState,
            measurementState: measurementState);
    }

    public OneOf<Success, DomainError> Rename(string name)
    {
        if (ValidateName(name) is { } nameError)
        {
            return nameError;
        }

        Name = name.Trim();
        return new Success();
    }

    public async Task<OneOf<Success, DomainError>> EnsureCanBeDeletedAsync(
        Func<Guid, string, ProductState, CancellationToken, Task<bool>> hasLinkedMeasurements,
        CancellationToken cancellationToken)
    {
        var hasLinkedMeasurementsResult = await hasLinkedMeasurements(ProductId, Id, ProductState, cancellationToken);
        if (hasLinkedMeasurementsResult)
        {
            return new DomainError($"Lot '{Id}' cannot be deleted because it has linked measurements.");
        }

        return new Success();
    }

    private static DomainError? ValidateName(string name) =>
        string.IsNullOrWhiteSpace(name) ? new DomainError("LotForSale name is required.") : null;
}
