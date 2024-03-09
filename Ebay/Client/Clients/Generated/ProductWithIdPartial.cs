namespace Ebay.Client.Clients.Generated;

public partial class ProductWithId
{
    /// <summary>
    /// Требуется ли повторная проверка товара
    /// </summary>
    public bool IsRecheckRequired =>
        (DateTime.UtcNow - DateTime.Parse(LastCheckTime).ToUniversalTime()) > TimeSpan.FromDays(WellKnown.RecheckTimeInDays);


}