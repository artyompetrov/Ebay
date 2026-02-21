namespace Server.Application.New.Models

open System

/// <summary>
/// Информация о файле паспорта товара.
/// </summary>
/// <param name="Id">Идентификатор паспорта.</param>
/// <param name="FileName">Имя файла паспорта.</param>
type Passport =
    {
        /// <summary>
        /// Идентификатор паспорта.
        /// </summary>
        Id: Guid

        /// <summary>
        /// Имя файла паспорта.
        /// </summary>
        FileName: string
    }
