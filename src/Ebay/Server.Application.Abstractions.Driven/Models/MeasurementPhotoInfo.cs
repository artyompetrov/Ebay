namespace Server.Application.Abstractions.Driven.Models;

public sealed record MeasurementPhotoInfo(
    Guid Id,
    string MeasurementId,
    string FileName,
    string ContentType,
    int Order,
    byte[] Content);