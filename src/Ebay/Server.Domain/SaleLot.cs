using System.ComponentModel.DataAnnotations;

namespace Server.Domain;

public sealed class SaleLot : AggregateRoot<string>
{
    private SaleLot(string id, string name) : base(id)
    {
        Name = name;
        Validate();
    }

    public static SaleLot Create(string id, string name)
    {
        return new SaleLot(id: id.Trim(), name: name);
    }

    [MaxLength(128)]
    public string Name
    {
        get;
        private set
        {
            field = value.Trim();
            Validate();
        }
    }

    public void Rename(string name)
    {
        Name = name;
        Validate();
    }

    private void Validate()
    {
        if (string.IsNullOrWhiteSpace(Id))
        {
            throw new ValidationException($"{nameof(Id)} cannot be empty string");
        }

        if (Id.Length > 7)
        {
            throw new ValidationException($"{nameof(Id)} should be 7 characters or less");
        }

        if (string.IsNullOrWhiteSpace(Name))
        {
            throw new ValidationException($"{nameof(Name)} cannot be empty string");
        }
    }
}
