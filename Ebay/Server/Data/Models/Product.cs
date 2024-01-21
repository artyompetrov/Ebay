using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Ebay.Server.Data.Models;

public sealed class Product
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string SearchQuery { get; set; } = null!;

    public List<Lot> Lots { get; set; } = null!;
}