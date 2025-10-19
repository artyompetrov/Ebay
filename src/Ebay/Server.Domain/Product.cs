using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Server.Domain.Measurements;

namespace Server.Domain;

public sealed class Product : AggregateRoot<Guid>
{
    private Product(
        Guid id,
        string name,
        DateTime lastCheckTime,
        int weight,
        List<RuSearchQuery> ruSearchQueries,
        List<SearchQuery> searchQueries) : base(id)
    {
        Name = name;
        LastCheckTime = lastCheckTime;
        Weight = weight;
        RuSearchQueries = ruSearchQueries;
        SearchQueries = searchQueries;
    }

    public static Product Create(
        string name,
        int weight,
        IReadOnlyList<string> searchQueries,
        IReadOnlyList<string> ruSearchQueries)
    {
        var productId = Guid.NewGuid();

        return new Product(
            id: productId,
            name: name,
            lastCheckTime: DateTime.MinValue,
            weight: weight,
            ruSearchQueries: ruSearchQueries
                .Select(x => new RuSearchQuery(
                    id: Guid.NewGuid(),
                    query: x,
                    productId: productId)).ToList(),
            searchQueries: searchQueries.Select(x => new SearchQuery(
                    id: Guid.NewGuid(),
                    query: x,
                    productId: productId))
                .ToList()
        );
    }
    
    public void Update(
        string name,
        int weight,
        IReadOnlyList<SearchQueryWithId> searchQueries,
        IReadOnlyList<SearchQueryWithId> ruSearchQueries)
    {
        
        Name = name;
        Weight = weight;
        
        
        SearchQueries = searchQueries.Select(x => new SearchQuery(
            id: x.Id,
            query: x.SearchQuery,
            productId: Id)).ToList();
        RuSearchQueries = ruSearchQueries.Select(x => new RuSearchQuery(
            id: x.Id,
            query: x.SearchQuery,
            productId: Id)).ToList();
    }

    public string Name { get; private set; }

    public IReadOnlyList<RuSearchQuery> RuSearchQueries { get; private set; }

    public IReadOnlyList<SearchQuery> SearchQueries { get; private set; }

    public DateTime LastCheckTime { get; private set; }

    public void MarkAsChecked()
    {
        LastCheckTime = DateTime.UtcNow;
    }

    public bool IsCheckRequired => DateTime.UtcNow - LastCheckTime > TimeSpan.FromDays(WellKnown.RecheckTimeInDays);

    public int Weight { get; private set; }

    public ProductCalculationResult? ProductCalculationResult { get; set; } = null;
}