namespace Server.Application.New.Models

open System
open Server.Domain.Measurements

/// <summary>
/// Информация о замере вместе с бинарными данными файла измерения.
/// </summary>
type MeasurementInfoWithData =
    {
        /// <summary>
        /// Идентификатор замера.
        /// </summary>
        Id: string

        /// <summary>
        /// Идентификатор товара, к которому относится замер.
        /// </summary>
        ProductId: Guid

        /// <summary>
        /// Идентификатор пары замеров.
        /// </summary>
        MatchId: string

        /// <summary>
        /// Идентификатор лота eBay.
        /// </summary>
        LotId: string

        /// <summary>
        /// Локация хранения товара или замера.
        /// </summary>
        Location: string

        /// <summary>
        /// Текущее состояние замера.
        /// </summary>
        MeasurementState: MeasurementState

        /// <summary>
        /// Состояние товара.
        /// </summary>
        ProductState: ProductState

        /// <summary>
        /// Код производителя лампы.
        /// </summary>
        ManufactureCode: string

        /// <summary>
        /// Дата и время последнего обнаружения на eBay.
        /// </summary>
        LastTimeWatchedOnEbay: Nullable<DateTime>

        /// <summary>
        /// Дата и время создания замера.
        /// </summary>
        CreatedAt: DateTime

        /// <summary>
        /// Сырые бинарные данные файла измерений.
        /// </summary>
        Data: byte[]
    }

    /// <summary>
    /// Признак, что замер был замечен на eBay в течение последних 7 дней.
    /// </summary>
    member this.IsPublishedOnEbay =
        this.LastTimeWatchedOnEbay.HasValue
        && this.LastTimeWatchedOnEbay.Value > DateTime.UtcNow.AddDays(-7.0)
