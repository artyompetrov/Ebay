namespace Server.Application.New.Models

/// <summary>
/// Параметры рабочей точки лампы.
/// </summary>
type TubeWorkingPointInfo =
    {
        /// <summary>
        /// Анодное напряжение, В.
        /// </summary>
        AnodeVoltage: double

        /// <summary>
        /// Напряжение на сетке, В.
        /// </summary>
        GridVoltage: double

        /// <summary>
        /// Полуширина диапазона анодного напряжения, В.
        /// </summary>
        AnodeVoltageHalfWidth: double

        /// <summary>
        /// Полуширина диапазона напряжения сетки, В.
        /// </summary>
        GridVoltageHalfWidth: double

        /// <summary>
        /// Номинальный ток, мА.
        /// </summary>
        NominalCurrent: double
    }
