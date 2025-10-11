namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

public sealed class ProductView
{
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public List<SearchQueryView> SearchQueries { get; set; } = null!;

    public DateTime LastCheckTime { get; set; }

    public int Weight { get; set; }

    public List<ProductPassportView> Passports { get; set; } = null!;
}