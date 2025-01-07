namespace Client.Clients.Generated;

/// <summary>
/// Расширение сгенеренного класса
/// </summary>
public partial class ProductWithId
{
    /// <summary>
    /// Требуется ли повторная проверка товара
    /// </summary>
    public bool IsRecheckRequired =>
        (DateTime.UtcNow - DateTime.Parse(LastCheckTime).ToUniversalTime()) > TimeSpan.FromDays(WellKnown.RecheckTimeInDays);


}