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
    
    public string GetCondition()
    {
        return Categories.Single(x => x.Type == WellKnown.Categories.Conditions.CategoryName).Value!;
    }

    public string GetTestState()
    {
        return Categories.Single(x => x.Type == WellKnown.Categories.TestState.CategoryName).Value!;
    }
}