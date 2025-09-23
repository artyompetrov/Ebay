namespace Server.Domain;

public class ProductEmailSendHistory
{
    public int Id { get; set; }

    public Guid ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public string Seller { get; set; } = null!;

    public string Link { get; set; } = null!;

    public string Marketplace { get; set; } = null!;

    public bool IsAmbiguous { get; set; }

    public DateTime CreatedAt { get; set; }
}