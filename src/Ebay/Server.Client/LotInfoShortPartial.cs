// ReSharper disable once CheckNamespace
namespace Client.Clients.Generated;

public partial class LotInfoShort
{
    public void SetIsRecentToPurchases()
    {
        foreach (var purchaseInfo in PurchaseHistory)
        {
            purchaseInfo.SetRecent(TitleChangeDate);
        }
    }
}