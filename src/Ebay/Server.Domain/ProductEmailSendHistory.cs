namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public class ProductEmailSendHistory
{
    /// <summary>
    /// свойство.
    /// </summary>
    public int Id { get; set; }

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
    public string Seller { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public string Link { get; set; } = null!;

    //todo нужно сделать логику чтобы не затиралась null значениями
    /// <summary>
    /// свойство.
    /// </summary>
    public string? Contact { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public string Marketplace { get; set; } = null!;

    /// <summary>
    /// свойство.
    /// </summary>
    public bool IsAmbiguous { get; set; }

    /// <summary>
    /// свойство.
    /// </summary>
    public DateTime CreatedAt { get; set; }
}
