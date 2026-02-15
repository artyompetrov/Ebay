namespace Server.Application.New.Models;

/// <summary>
/// Информация о файле паспорта товара.
/// </summary>
/// <param name="Id">Идентификатор паспорта.</param>
/// <param name="FileName">Имя файла паспорта.</param>
public record Passport(Guid Id, string FileName);
