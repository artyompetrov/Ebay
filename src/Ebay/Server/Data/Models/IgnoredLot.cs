using Microsoft.EntityFrameworkCore;

namespace Server.Data.Models;

[PrimaryKey(propertyName: nameof(ProductId), nameof(LotId))]
public class IgnoredLot
{
    public Guid ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public long LotId { get; set; }
}