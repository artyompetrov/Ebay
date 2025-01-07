using System.ComponentModel.DataAnnotations;

namespace Server.Data.Models;

internal class ClientError
{
    [Key]
    public Guid Id { get; set; }

    public string Url { get; set; } = null!;


    public string ErrorText { get; set; } = null!;
}