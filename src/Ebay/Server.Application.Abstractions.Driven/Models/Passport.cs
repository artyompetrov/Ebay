namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Информация о файле паспорта товара.
/// </summary>
/// <param name="Id">Идентификатор паспорта.</param>
/// <param name="FileName">Имя файла паспорта.</param>
/// <param name="Order">Порядковый номер паспорта среди паспортов товара.</param>
public record Passport(Guid Id, string FileName, int Order);