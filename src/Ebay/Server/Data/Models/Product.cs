using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Data.Models;

internal sealed class Product
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid Id { get; set; }

    public string Name { get; set; } = null!;

    public List<RuSearchQuery> RuSearchQueries { get; set; } = null!;
    
    public List<SearchQuery> SearchQueries { get; set; } = null!;

    public List<Lot> Lots { get; set; } = null!;

    public DateTime LastCheckTime { get; set; }

    public int Weight { get; set; }
}