using Server.Domain.Abstractions;

namespace Server.Domain.Measurements;

public sealed class MeasurementPhoto : AggregateRoot<Guid>
{
    private MeasurementPhoto(
        Guid id,
        string measurementId,
        string fileName,
        string contentType,
        int order,
        byte[] content,
        byte[] thumbnailContent) : base(id)
    {
        MeasurementId = measurementId;
        FileName = fileName;
        ContentType = contentType;
        Order = order;
        Content = content;
        ThumbnailContent = thumbnailContent;
    }

    public string MeasurementId { get; private set; } = null!;

    public string FileName { get; private set; } = null!;

    public string ContentType { get; private set; } = null!;

    public int Order { get; private set; }

    public byte[] Content { get; private set; } = null!;

    public byte[] ThumbnailContent { get; private set; } = null!;

    public static MeasurementPhoto Create(
        Guid id,
        string measurementId,
        string fileName,
        string contentType,
        int order,
        byte[] content,
        byte[] thumbnailContent)
    {
        return new MeasurementPhoto(
            id: id,
            measurementId: measurementId.Trim(),
            fileName: fileName.Trim(),
            contentType: contentType.Trim(),
            order: order,
            content: content,
            thumbnailContent: thumbnailContent);
    }

    public void ShiftOrderDown() => Order--;
}