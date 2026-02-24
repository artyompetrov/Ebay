using System.ComponentModel.DataAnnotations;

namespace Server.Configuration;

public class AuthorizationClientOptions
{
    public const string SectionName = "AuthorizationClient";

    [Required]
    public string DataProtectionKeysDirectory { get; init; } = null!;

    [Required]
    public string Domain { get; init; } = null!;

    [Required]
    public string ClientId { get; init; } = null!;

    [Required]
    public string Scope { get; init; } = null!;

    [Required]
    public string ClientSecret { get; init; } = null!;
}