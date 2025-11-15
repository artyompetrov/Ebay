using System.ComponentModel.DataAnnotations;

namespace Server.Application.Data
{
    public class CacheEntry
    {
        [MaxLength(500)]
        public string Key { get; set; } = null!;

        [MaxLength(50)]
        [Required]
        public string Version { get; set; } = null!;

        [Required]
        public string Value { get; set; } = null!;

        [Required]
        public DateTime ExpiresAt { get; set; }
    }
}