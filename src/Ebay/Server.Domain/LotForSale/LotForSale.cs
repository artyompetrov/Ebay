using Server.Domain.Abstractions;

namespace Server.Domain.LotForSale;

public sealed class LotForSale : AggregateRoot<string>
{
    private const int IdLength = 7;

    private LotForSale(string id, string name, Guid productId) : base(id)
    {
        Name = name;
        ProductId = productId;
    }

    public string Name { get; private set; }

    public Guid ProductId { get; private set; }

    public static LotForSale Create(string id, string name, Guid productId)
    {
        ValidateId(id);
        ValidateName(name);
        ValidateProductId(productId);

        return new LotForSale(
            id: id,
            name: name.Trim(),
            productId: productId);
    }

    public void Rename(string name)
    {
        ValidateName(name);
        Name = name.Trim();
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
