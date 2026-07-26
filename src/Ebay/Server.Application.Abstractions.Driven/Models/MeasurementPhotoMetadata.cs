namespace Server.Application.Abstractions.Driven.Models;

public sealed record MeasurementPhotoMetadata(
    Guid Id,
    string MeasurementId,
    string FileName,
    int Order);
