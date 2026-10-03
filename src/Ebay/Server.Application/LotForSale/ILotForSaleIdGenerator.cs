namespace Server.Application.LotForSale;

/// <summary>
/// Генерирует идентификаторы для агрегата лота для продажи.
/// </summary>
public interface ILotForSaleIdGenerator
{
    /// <summary>
    /// Генерирует следующий идентификатор лота для продажи.
    /// </summary>
    /// <returns>Семисимвольный идентификатор лота.</returns>
    string GenerateNextId();
}