using System.ComponentModel.DataAnnotations;

namespace Server.Application.Data.Models;

public class CacheEntry
{
    [Key]
    [MaxLength(500)]
    public string Key { get; set; } = null!;

    [Required]
    public string Value { get; set; } = null!;
    
    [Required]
    public DateTime ExpiresAt { get; set; }
}