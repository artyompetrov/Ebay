using Server.Domain.Abstractions;

namespace Server.Domain.LotForSale;

public sealed class LotForSale : AggregateRoot<string>
{
    private const int IdLength = 7;

    private LotForSale(string id, string name) : base(id)
    {
        Name = name;
    }

    public string Name { get; private set; }

    public static LotForSale Create(string id, string name)
    {
        ValidateId(id);
        ValidateName(name);

        return new LotForSale(
            id: id,
            name: name.Trim());
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
}
