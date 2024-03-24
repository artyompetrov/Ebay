using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Ebay.Server.Data.Models;

[PrimaryKey(nameof(ProductId), nameof(LotId))]
internal class IgnoredLot
{
    public Guid ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public long LotId { get; set; }
}