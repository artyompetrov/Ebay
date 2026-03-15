using Server.Domain.Abstractions;

namespace Server.Domain.Product;

public sealed class Product : AggregateRoot<Guid>
{
    private readonly List<SearchQuery> _ruSearchQueries = [];
    private readonly List<SearchQuery> _searchQueries = [];

    private Product(Guid id, string name, DateTimeOffset lastCheckTime, int weight) : base(id)
    {
        Name = name;
        LastCheckTime = lastCheckTime;
        Weight = weight;
    }

    public static Product Create(
        string name,
        int weight,
        IReadOnlyList<string> searchQueries,
        IReadOnlyList<string> ruSearchQueries)
    {
        var productId = Guid.NewGuid();

        var product = new Product(
            id: productId,
            name: name,
            lastCheckTime: DateTimeOffset.MinValue,
            weight: weight);

        product.AddDomainEvent(new ProductUpdated(product.Id));

        product._ruSearchQueries.AddRange(
            ruSearchQueries.Select(x => new SearchQuery(Guid.NewGuid(), x, productId)));

        product._searchQueries.AddRange(
            searchQueries.Select(x => new SearchQuery(Guid.NewGuid(), x, productId)));

        return product;
    }

    public void Update(
        string name,
        int weight,
        IReadOnlyList<SearchQueryWithId> searchQueries,
        IReadOnlyList<SearchQueryWithId> ruSearchQueries)
    {
        Name = name;
        Weight = weight;

        // en
        var incomingEn = searchQueries.ToDictionary(x => x.Id);
        // удалить те, которых нет во входе
        _searchQueries.RemoveAll(sq => !incomingEn.ContainsKey(sq.Id));
        // обновить существующие и добавить новые
        foreach (var kv in incomingEn)
        {
            var existing = _searchQueries.FirstOrDefault(x => x.Id == kv.Key);
            if (existing is null)
            {
                _searchQueries.Add(new SearchQuery(kv.Key, kv.Value.Query, Id));
            }
            else
            {
                existing.SetQuery(kv.Value.Query); // сделай метод изменить Query
            }
        }

        // ru
        var incomingRu = ruSearchQueries.ToDictionary(x => x.Id);
        _ruSearchQueries.RemoveAll(sq => !incomingRu.ContainsKey(sq.Id));
        foreach (var kv in incomingRu)
        {
            var existing = _ruSearchQueries.FirstOrDefault(x => x.Id == kv.Key);
            if (existing is null)
            {
                _ruSearchQueries.Add(new SearchQuery(kv.Key, kv.Value.Query, Id));
            }
            else
            {
                existing.SetQuery(kv.Value.Query);
            }
        }

        AddDomainEvent(new ProductUpdated(Id));
    }

    public string Name { get; private set; }
    public DateTimeOffset LastCheckTime { get; private set; }
    public int Weight { get; private set; }

    public ProductCalculationResult? ProductCalculationResult { get; set; }

    public IReadOnlyList<SearchQuery> RuSearchQueries => _ruSearchQueries;
    public IReadOnlyList<SearchQuery> SearchQueries => _searchQueries;

    public void MarkAsChecked() => LastCheckTime = DateTimeOffset.UtcNow;
}
