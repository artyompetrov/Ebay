namespace Server.Domain;

/// <summary>
/// класс доменной модели.
/// </summary>
public class IgnoredLot
{
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
    public long LotId { get; set; }
}
