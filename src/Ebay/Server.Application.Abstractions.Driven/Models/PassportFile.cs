namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Файл паспорта товара вместе с его содержимым.
/// </summary>
/// <param name="FileName">Имя файла паспорта.</param>
/// <param name="ContentType">MIME-тип содержимого.</param>
/// <param name="Content">Содержимое файла.</param>
public record PassportFile(string FileName, string ContentType, byte[] Content);
