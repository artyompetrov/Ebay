using Server.Domain.Abstractions;
using Server.Domain.Exceptions;
using Server.Domain.Measurements;

namespace Server.Domain.LotForSale;

public sealed class LotForSale : AggregateRoot<string>
{
    private const int IdLength = 7;

    private LotForSale(string id, string name, Guid productId, ProductState productState) : base(id)
    {
        ValidateId(id);
        Name = name;
        ProductId = productId;
        ProductState = productState;
    }

    public string Name { get; private set; }

    public Guid ProductId { get; private set; }

    public ProductState ProductState { get; private set; }

    public static LotForSale Create(string id, string name, Guid productId, ProductState productState)
    {
        ValidateId(id);
        ValidateName(name);
        ValidateProductId(productId);

        return new LotForSale(
            id: id,
            name: name.Trim(),
            productId: productId,
            productState: productState);
    }

    public void Rename(string name)
    {
        ValidateName(name);
        Name = name.Trim();
    }

    public async Task EnsureCanBeDeletedAsync(
        Func<Guid, string, ProductState, CancellationToken, Task<bool>> hasLinkedMeasurements,
        CancellationToken cancellationToken)
    {
        ArgumentNullException.ThrowIfNull(hasLinkedMeasurements);

        var hasLinkedMeasurementsResult = await hasLinkedMeasurements(ProductId, Id, ProductState, cancellationToken);
        if (hasLinkedMeasurementsResult)
        {
            throw new DomainException($"Lot '{Id}' cannot be deleted because it has linked measurements.");
        }
    }

    private static void ValidateId(string id)
    {
        if (string.IsNullOrWhiteSpace(id) || id.Length != IdLength)
        {
            throw new ArgumentException($"LotForSale Id must contain exactly {IdLength} symbols.", nameof(id));
        }
    }

    private static void ValidateName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("LotForSale name is required.", nameof(name));
        }
    }

    private static void ValidateProductId(Guid productId)
    {
        if (productId == Guid.Empty)
        {
            throw new ArgumentException("ProductId is required.", nameof(productId));
        }
    }
}
