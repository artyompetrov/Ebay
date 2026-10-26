namespace Server.Adapters.Driven.EF.Identity;

/// <summary>
/// Credentials of the sign-in user that a local development run creates in an empty database. Only
/// <c>Server/Properties/launchSettings.json</c> sets them; see <see cref="DevelopmentUserSeeder" />.
/// </summary>
public sealed record DevelopmentUserOptions
{
    public const string SectionName = "DevelopmentUser";

    public string? Email { get; init; }

    public string? Password { get; init; }
}
