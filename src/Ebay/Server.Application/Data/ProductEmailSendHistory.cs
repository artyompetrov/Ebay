namespace Server.Application.Data;

using Server.Application.Data.Models;

public class ProductEmailSendHistory
{
    public int Id { get; set; }

    public Guid ProductId { get; set; }

    public Product Product { get; set; } = null!;

    public string Seller { get; set; } = null!;

    public string Link { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}