namespace Server.Application.New;

/// <summary>
/// Бинарное содержимое фотографии или её миниатюры вместе с типом содержимого.
/// </summary>
/// <param name="Content">Байты изображения.</param>
/// <param name="ContentType">MIME-тип изображения.</param>
public sealed record MeasurementPhotoContent(byte[] Content, string ContentType);
