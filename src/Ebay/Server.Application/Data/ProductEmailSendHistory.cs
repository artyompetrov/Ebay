namespace Server.Application.Data;

public class ProductEmailSendHistory
{
    public int Id { get; set; }
    public string ProductKey { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}