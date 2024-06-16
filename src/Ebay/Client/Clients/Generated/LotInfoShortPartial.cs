namespace Ebay.Client.Clients.Generated;

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