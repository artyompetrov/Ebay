namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

internal sealed class SaleLotView
{
    public string Id { get; init; } = null!;

    public string Name { get; init; } = null!;

    public DateTime CreatedAt { get; init; }

    public DateTime ChangedAt { get; init; }
}
