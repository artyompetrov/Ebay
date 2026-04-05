namespace Server.Adapters.Driven.EF.ReadModel.ReadModelSchema;

internal sealed class MeasurementPhotoView
{
    public Guid Id { get; init; }

    public string MeasurementId { get; init; } = null!;

    public string FileName { get; init; } = null!;

    public string ContentType { get; init; } = null!;

    public int Order { get; init; }

    public byte[] Content { get; init; } = null!;
}
