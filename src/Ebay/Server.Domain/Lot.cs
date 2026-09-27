using Server.Domain.Abstractions;

namespace Server.Domain;

public sealed class Lot : AggregateRoot<long>
{
    private readonly List<Purchase> _purchases = [];
    private Dictionary<string, string> _categories;

    private Lot(
        long id,
        Guid productId,
        string name,
        int pcs,
        int? lotSize,
        string currencyId,
        string shippingCountry,
        double price,
        double shipping,
        double shippingAdditional,
        string description,
        string? shortDescription,
        string condition,
        string? conditionDescription,
        string seller,
        string locatedIn,
        DateTimeOffset titleChangeDate,
        DateTimeOffset updateDate,
        IReadOnlyDictionary<string, string> categories) : base(id)
    {
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
        ShortDescription = shortDescription;
        Condition = condition;
        ConditionDescription = conditionDescription;
        Seller = seller;
        LocatedIn = locatedIn;
        TitleChangeDate = titleChangeDate;
        UpdateDate = updateDate;
        _categories = new Dictionary<string, string>(categories);
    }

    public Guid ProductId { get; }

    public string Name { get; private set; }

    public int Pcs { get; private set; }

    public int? LotSize { get; private set; }

    public string CurrencyId { get; private set; }

    public string ShippingCountry { get; private set; }

    public double Price { get; private set; }

    public double Shipping { get; private set; }

    public double ShippingAdditional { get; private set; }

    public string Description { get; private set; }

    public string? ShortDescription { get; private set; }

    public string Condition { get; private set; }

    public string? ConditionDescription { get; private set; }

    public string Seller { get; private set; }

    public string LocatedIn { get; private set; }

    public DateTimeOffset TitleChangeDate { get; private set; }

    public DateTimeOffset UpdateDate { get; private set; }

    public IReadOnlyDictionary<string, string> Categories => _categories;

    public IReadOnlyList<Purchase> Purchases => _purchases;

    public LotCalculationResult? LotCalculationResult { get; private set; }

    public static Lot Create(
        long id,
        Guid productId,
        string name,
        int pcs,
        int? lotSize,
        string currencyId,
        string shippingCountry,
        double price,
        double shipping,
        double shippingAdditional,
        string description,
        string? shortDescription,
        string condition,
        string? conditionDescription,
        string seller,
        string locatedIn,
        DateTimeOffset titleChangeDate,
        DateTimeOffset updateDate,
        IReadOnlyDictionary<string, string> categories) => new(
        id: id,
        productId: productId,
        name: name,
        pcs: pcs,
        lotSize: lotSize,
        currencyId: currencyId,
        shippingCountry: shippingCountry,
        price: price,
        shipping: shipping,
        shippingAdditional: shippingAdditional,
        description: description,
        shortDescription: shortDescription,
        condition: condition,
        conditionDescription: conditionDescription,
        seller: seller,
        locatedIn: locatedIn,
        titleChangeDate: titleChangeDate,
        updateDate: updateDate,
        categories: categories);

    public void UpdateInfo(
        string name,
        int pcs,
        int? lotSize,
        string currencyId,
        string shippingCountry,
        double price,
        double shipping,
        double shippingAdditional,
        string description,
        string? shortDescription,
        string condition,
        string? conditionDescription,
        string seller,
        string locatedIn,
        DateTimeOffset titleChangeDate,
        DateTimeOffset updateDate,
        IReadOnlyDictionary<string, string> categories)
    {
        Name = name;
        Pcs = pcs;
        LotSize = lotSize;
        CurrencyId = currencyId;
        ShippingCountry = shippingCountry;
        Price = price;
        Shipping = shipping;
        ShippingAdditional = shippingAdditional;
        Description = description;
        ShortDescription = shortDescription;
        Condition = condition;
        ConditionDescription = conditionDescription;
        Seller = seller;
        LocatedIn = locatedIn;
        TitleChangeDate = titleChangeDate;
        UpdateDate = updateDate;
        // Новый объект вместо мутации существующего словаря - EF отслеживает изменение hstore-колонки
        // по ссылке на значение конвертера, а не по содержимому (см. Value Comparer в EF Core).
        _categories = new Dictionary<string, string>(categories);
    }

    /// <summary>
    /// Добавляет запись о покупке лота или обновляет уже существующую за ту же дату.
    /// </summary>
    public void UpsertPurchase(DateTimeOffset date, double? price, int quantity)
    {
        var existing = _purchases.FirstOrDefault(x => x.Date == date);
        if (existing is null)
        {
            _purchases.Add(Purchase.Create(date, Id, price, quantity));
        }
        else
        {
            existing.UpdateAmount(price, quantity);
        }
    }

    /// <summary>
    /// Удаляет записи о покупках лота раньше указанной даты (например, после смены заголовка лота).
    /// </summary>
    public void RemovePurchasesBefore(DateTimeOffset threshold) => _purchases.RemoveAll(x => x.Date < threshold);

    public void SetCalculationResult(LotCalculationResult result) => LotCalculationResult = result;
}
