namespace Server.Application.New.Models

open System
open System.Collections.Generic
open Server.Domain.Measurements

/// <summary>
/// DTO для отображения замера и найденных похожих вариантов.
/// </summary>
type MeasurementInfoWithSimilarMeasurements =
    {
        /// <summary>
        /// Основная информация по исходному замеру.
        /// </summary>
        MeasurementInfo: MeasurementInfo

        /// <summary>
        /// Разница секций (RMSE) для двойного триода, если применимо.
        /// </summary>
        DoubleTriodeSectionRmse: Nullable<double>

        /// <summary>
        /// Список похожих замеров.
        /// </summary>
        SimilarMeasurements: IReadOnlyCollection<SimilarMeasurementInfo>

        /// <summary>
        /// Итоговый скор для сортировки похожих замеров.
        /// </summary>
        ScorePlusBalance: Nullable<double>
    }

/// <summary>
/// Информация о замере, похожем на исходный, и метрики их сравнения.
/// </summary>
and SimilarMeasurementInfo =
    {
        /// <summary>
        /// Идентификатор похожего замера.
        /// </summary>
        MeasurementId: string

        /// <summary>
        /// Код производителя похожего замера.
        /// </summary>
        ManufactureCode: string

        /// <summary>
        /// RMSE первой секции.
        /// </summary>
        RmseSection1: double

        /// <summary>
        /// RMSE второй секции, если есть.
        /// </summary>
        RmseSection2: Nullable<double>

        /// <summary>
        /// Режим сравнения замеров.
        /// </summary>
        ComparisonMode: ComparisonMode

        /// <summary>
        /// Итоговый скор похожести (меньше лучше).
        /// </summary>
        Score: double

        /// <summary>
        /// Признак, что замеры уже находятся в паре.
        /// </summary>
        IsMatchedPair: bool

        /// <summary>
        /// Разница секций для похожего замера, если применимо.
        /// </summary>
        DoubleTriodeSectionRmse: Nullable<double>

        /// <summary>
        /// Идентификатор пары похожего замера.
        /// </summary>
        MatchId: string
    }
