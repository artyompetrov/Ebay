using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public sealed class ProductPassport
{
    /// <summary>
    /// свойство.
    /// </summary>
    [Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
    public Guid Id { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public Guid ProductId { get; set; }
    /// <summary>
    /// свойство.
    /// </summary>
    public Product Product { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    [MaxLength(200)]
    public required string FileName { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    [MaxLength(100)]
    public required string ContentType { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public int Order { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public required byte[] Content { get; set; } = null!;
}
