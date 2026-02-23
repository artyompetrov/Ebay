using Server.Domain.Abstractions;
using Server.Domain.Measurements;

namespace Server.Domain.LotForSale;

public sealed class LotForSale : AggregateRoot<string>
{
    private const int IdLength = 7;
    private const string IdAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    private static readonly DateTime IdEpoch = new(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

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

    public static LotForSale Create(string name, Guid productId, ProductState productState)
    {
        ValidateName(name);
        ValidateProductId(productId);

        return new LotForSale(
            id: GenerateId(),
            name: name.Trim(),
            productId: productId,
            productState: productState);
    }

    public void Rename(string name)
    {
        ValidateName(name);
        Name = name.Trim();
    }

    private static string GenerateId()
    {
        var elapsedMicroseconds = (DateTime.UtcNow - IdEpoch).Ticks / 10;
        if (elapsedMicroseconds < 0)
        {
            elapsedMicroseconds = 0;
        }

        var idBuffer = new char[IdLength];
        var value = elapsedMicroseconds;

        for (var i = IdLength - 1; i >= 0; i--)
        {
            idBuffer[i] = IdAlphabet[(int)(value & 63)];
            value >>= 6;
        }

        return new string(idBuffer);
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
