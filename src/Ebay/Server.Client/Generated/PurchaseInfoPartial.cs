namespace Client.Clients.Generated;

public partial class PurchaseInfo
{
    public bool IsRecent { get; private set; } = true;

    public void SetRecent(string titleChangeDate)
    {
        var titleChangeDateParsed = DateTime.Parse(titleChangeDate);

        var purchaseDate = DateTime.Parse(Date);

        IsRecent = titleChangeDateParsed < purchaseDate;
    }
}