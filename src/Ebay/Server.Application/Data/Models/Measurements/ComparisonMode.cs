namespace Server.Application.Data.Models.Measurements;

public enum ComparisonMode
{
    /// <summary>
    /// Сравнение первой секции с первой, второй со второй.
    /// </summary>
    Direct = 0,

    /// <summary>
    /// Сравнение первой секции со второй, второй с первой.
    /// </summary>
    Cross = 1
}