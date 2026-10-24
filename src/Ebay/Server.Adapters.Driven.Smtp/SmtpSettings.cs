namespace Server.Adapters.Driven.Smtp;

/// <summary>
/// Настройки SMTP-сервера, через который отправляются письма.
/// </summary>
public sealed record class SmtpSettings
{
    public const string SectionName = "Smtp";

    public string Server { get; init; } = null!;

    public int Port { get; init; }

    public string Login { get; init; } = null!;

    public string Password { get; init; } = null!;

    public string Email { get; init; } = null!;

    /// <summary>
    /// Пауза после отправки письма, чтобы не упереться в ограничения SMTP-сервера.
    /// </summary>
    public TimeSpan DelayAfterEmail { get; init; } = TimeSpan.FromSeconds(5);
}
