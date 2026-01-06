using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Domain.Exceptions;
using OneOf;

namespace Server.Domain;

public class Lot : AggregateRoot<long>
{

    public static OneOf<Lot, DomainError> Create(
        long id,
        double shippingAdditional,
        double shipping,
        IReadOnlyDictionary<string, string> categories,
        DateTime titleChangeDate)
    {
        if (!new HashSet<string> { WellKnown.Categories.Conditions.CategoryName, WellKnown.Categories.TestState.CategoryName }
                .SequenceEqual(
                    categories.Select(x => x.Key)
            ))
        {

            return new DomainError("Not all categories set");
        }
        
        return new Lot(id, shippingAdditional, shipping, titleChangeDate);
    }
    
    private Lot(
        long id,
        double shippingAdditional,
        double shipping,
        DateTime titleChangeDate,
        Guid productId,
        string name,
        int pcs,
        int? lotSize,
        string currencyId,
        string shippingCountry,
        double price,
        string description,
        string? shortDescription,
        string condition,
        string conditionDescription,
        string seller,
        string locatedIn,
        DateTime updateDate,
        IReadOnlyDictionary<string, string> categories,
        IReadOnlyList<Purchase> purchases,
        LotCalculationResult? lotCalculationResult
        )  : base(id)
    {
        UpdateDate = DateTime.UtcNow;
        TitleChangeDate = titleChangeDate;
        ProductId = productId;
        Name = name;
        Pcs = pcs;
        LotSize = lotSize;
        CurrencyId = currencyId;
        ShippingCountry = shippingCountry;
        Price = price;
        Shipping = shipping;
        ShippingAdditional = shippingAdditional;
        Description = description;
        ShortDescription =  shortDescription;
        Condition = condition;
        ConditionDescription = conditionDescription;
        Seller = seller;
        LocatedIn = locatedIn;
        UpdateDate = updateDate;
        Categories = categories;
        Purchases = purchases;
        LotCalculationResult = lotCalculationResult;
    }
    
    public Guid ProductId { get; private set; }

    // То же самое, что и title, но в коде везде используется Name
    public string Name { get; }

    public int Pcs { get;  }

    public int? LotSize { get; }

    [ForeignKey("CurrencyEbayName")]
    public string CurrencyId { get; }

    public string ShippingCountry { get; }

    public double Price { get; }

    public double Shipping { get; }

    public double ShippingAdditional { get; }

    public string Description { get; }

    public string? ShortDescription { get; }

    public string Condition { get; }

    public string? ConditionDescription { get; }

    public string Seller { get; }

    public string LocatedIn { get; }

    public DateTime TitleChangeDate { get; }

    public DateTime UpdateDate { get; }

    public IReadOnlyDictionary<string, string> Categories { get; }

    public IReadOnlyList<Purchase> Purchases { get; }

    public LotCalculationResult? LotCalculationResult { get; }
}