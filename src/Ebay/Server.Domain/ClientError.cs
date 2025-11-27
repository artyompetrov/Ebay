using System.ComponentModel.DataAnnotations;

namespace Server.Domain;

public class ClientError
{
    [Key]
    public Guid Id { get; set; }

    public string Url { get; set; } = null!;


    public string ErrorText { get; set; } = null!;
}
