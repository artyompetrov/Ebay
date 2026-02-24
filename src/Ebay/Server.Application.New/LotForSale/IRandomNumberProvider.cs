namespace Server.Application.New.LotForSale;

/// <summary>
/// Предоставляет случайные числа для генерации идентификаторов.
/// </summary>
public interface IRandomNumberProvider
{
    /// <summary>
    /// Возвращает случайное число из диапазона [minInclusive, maxExclusive).
    /// </summary>
    /// <param name="minInclusive">Нижняя граница диапазона (включительно).</param>
    /// <param name="maxExclusive">Верхняя граница диапазона (не включительно).</param>
    /// <returns>Случайное число из заданного диапазона.</returns>
    int Next(int minInclusive, int maxExclusive);
}