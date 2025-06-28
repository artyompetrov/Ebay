using System.ComponentModel.DataAnnotations;

namespace Server.Application.Data;

public class EmailSendHistory
{
    public int Id { get; set; }
    public string EmailId { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
}