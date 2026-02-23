using System.ComponentModel.DataAnnotations;

namespace Server.Configuration;

public class AuthorizationClientOptions
{
    public const string SectionName = "AuthorizationClient";

    [Required]
    public string DataProtectionKeysDirectory { get; set; } = null!;

    [Required]
    public string Domain { get; set; } = null!;

    [Required]
    public string ClientId { get; set; } = null!;

    [Required]
    public string Scope { get; set; } = null!;

    [Required]
    public string ClientSecret { get; set; } = null!;
}
