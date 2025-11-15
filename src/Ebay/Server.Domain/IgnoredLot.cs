namespace Server.Domain
{
    public class IgnoredLot
    {
        public Guid ProductId { get; set; }

        public Product Product { get; set; } = null!;

        public long LotId { get; set; }
    }
}