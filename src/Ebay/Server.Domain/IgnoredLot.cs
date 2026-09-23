namespace Server.Domain;

/// <summary>
/// Отметка о том, что лот для товара намеренно проигнорирован (не будет обрабатываться расчётами) -
/// не несёт собственных данных сверх пары (ProductId, LotId), поэтому не является агрегатом.
/// </summary>
public sealed class IgnoredLot
{
    private IgnoredLot(Guid productId, long lotId)
    {
        ProductId = productId;
        LotId = lotId;
    }

    public static IgnoredLot Create(Guid productId, long lotId) => new(productId, lotId);

    public Guid ProductId { get; }

    public long LotId { get; }
}
