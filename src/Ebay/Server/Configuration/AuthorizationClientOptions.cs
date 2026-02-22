using System.ComponentModel.DataAnnotations;

namespace Server.Configuration;

public class AuthorizationClientOptions
{
    public const string SectionName = "AuthorizationClient";

    [Required]
    public string DataProtectionKeysDirectory { get; init; } =
        Path.Join(path1: Path.GetTempPath(), path2: "data_protection_keys_dir");

    [Required]
    public string Domain { get; init; } = "localhost";

    [Required]
    public string ClientId { get; init; } = "client_id";

    [Required]
    public string Scope { get; init; } = "scope";

    [Required]
    public string ClientSecret { get; init; } = "secret";
}
