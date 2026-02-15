namespace Server.Domain;

public abstract class Entity<TId>
{
    protected Entity(TId id)
    {
        Id = id;
    }

    public DateTime CreatedAt { get; private set; }
    public DateTime ChangedAt { get; private set; }

    public TId Id { get; }

    public override bool Equals(object? obj) => obj is Entity<TId> other && (ReferenceEquals(this, other) || EqualityComparer<TId>.Default.Equals(Id, other.Id));

    public override int GetHashCode() => Id?.GetHashCode() ?? 0;
}