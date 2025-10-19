using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Domain.Measurements;

namespace Server.Domain;

public sealed class Product : AggregateRoot<Guid>
{
    private readonly List<RuSearchQuery> _ruSearchQueries = new();
    private readonly List<SearchQuery> _searchQueries = new();
    
    private Product(Guid id, string name, DateTime lastCheckTime, int weight) : base(id)
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
            lastCheckTime: DateTime.MinValue,
            weight: weight);

        product._ruSearchQueries.AddRange(
            ruSearchQueries.Select(x => new RuSearchQuery(Guid.NewGuid(), x, productId)));

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

        _searchQueries.Clear();
        _searchQueries.AddRange(searchQueries.Select(x => new SearchQuery(x.Id, x.SearchQuery, Id)));

        _ruSearchQueries.Clear();
        _ruSearchQueries.AddRange(ruSearchQueries.Select(x => new RuSearchQuery(x.Id, x.SearchQuery, Id)));
    }

    public string Name { get; private set; } = default!;
    public DateTime LastCheckTime { get; private set; }
    public int Weight { get; private set; }
    
    public ProductCalculationResult? ProductCalculationResult { get; set; }
    
    public IReadOnlyList<RuSearchQuery> RuSearchQueries => _ruSearchQueries;
    public IReadOnlyList<SearchQuery> SearchQueries => _searchQueries;

    public void MarkAsChecked() => LastCheckTime = DateTime.UtcNow;
    public bool IsCheckRequired => DateTime.UtcNow - LastCheckTime > TimeSpan.FromDays(WellKnown.RecheckTimeInDays);
    
}
