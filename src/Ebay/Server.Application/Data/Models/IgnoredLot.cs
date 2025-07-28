using Microsoft.EntityFrameworkCore;

namespace Server.Application.Data.Models;

[PrimaryKey(propertyName: nameof(ProductId), nameof(LotId))]
public class IgnoredLot
{
    public Guid ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public long LotId { get; set; }
}