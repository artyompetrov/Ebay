using Server.Domain.Abstractions;

namespace Server.Domain;

/// <summary>
/// Файл паспорта товара (например, сертификат или техническое описание).
/// </summary>
public sealed class ProductPassport : AggregateRoot<Guid>
{
    private ProductPassport(
        Guid id,
        Guid productId,
        string fileName,
        string contentType,
        int order,
        byte[] content)
        : base(id)
    {
        ProductId = productId;
        FileName = fileName;
        ContentType = contentType;
        Order = order;
        Content = content;
    }

    public static ProductPassport Create(
        Guid productId,
        string fileName,
        string contentType,
        int order,
        byte[] content) =>
        new(
            id: Guid.NewGuid(),
            productId: productId,
            fileName: fileName,
            contentType: contentType,
            order: order,
            content: content);

    public Guid ProductId { get; }

    public string FileName { get; }

    public string ContentType { get; }

    public int Order { get; private set; }

    public byte[] Content { get; }

    /// <summary>
    /// Устанавливает новый порядковый номер - используется при удалении соседних паспортов (сдвиг, чтобы не
    /// оставлять пропуски) и при явном изменении порядка паспортов товара.
    /// </summary>
    public void SetOrder(int order) => Order = order;
}
