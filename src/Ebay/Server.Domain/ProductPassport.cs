using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain;

public sealed class ProductPassport
{
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid Id { get; set; }

    public Guid ProductId { get; set; }
    public Product.Product Product { get; set; } = null!;

    [MaxLength(200)]
    public required string FileName { get; set; } = null!;

    [MaxLength(100)]
    public required string ContentType { get; set; } = null!;

    public int Order { get; set; }

    public required byte[] Content { get; set; } = null!;
}