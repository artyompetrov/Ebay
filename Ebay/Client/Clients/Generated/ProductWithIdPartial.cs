namespace Ebay.Client.Clients.Generated;

public partial class ProductWithId
{
    public bool IsRecheckRequired =>
        (DateTime.UtcNow - DateTime.Parse(LastCheckTime).ToUniversalTime()) > TimeSpan.FromDays(WellKnown.RecheckTimeInDays);


}