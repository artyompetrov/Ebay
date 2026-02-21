namespace Server.Application.New.Models

open System
open Server.Domain.Measurements

/// <summary>
/// Краткая информация о замере товара для отображения в интерфейсе.
/// </summary>
type MeasurementInfo =
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
        /// Дата и время создания замера.
        /// </summary>
        CreatedAt: DateTime

        /// <summary>
        /// Дата и время последнего обнаружения на eBay.
        /// </summary>
        LastTimeWatchedOnEbay: Nullable<DateTime>
    }

type Extended =
    {
        MeasurementInfo with UserId: string
    }