namespace Server.Domain
{
    public abstract class Entity<TId>
    {
        protected Entity(TId id)
        {
            Id = id;
        }

        public TId Id { get; }

        public override bool Equals(object? obj)
        {
            return obj is not Entity<TId> other ? false : ReferenceEquals(this, other) || EqualityComparer<TId>.Default.Equals(Id, other.Id);
        }

        public override int GetHashCode()
        {
            return Id?.GetHashCode() ?? 0;
        }
    }
}