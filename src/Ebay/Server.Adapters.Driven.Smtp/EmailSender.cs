using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Server.Adapters.Driven.Smtp;

/// <summary>
/// Отправляет HTML-письмо через SMTP-сервер из <see cref="SmtpSettings"/>.
/// </summary>
internal sealed class EmailSender
{
    private readonly SmtpSettings _settings;

    public EmailSender(IOptions<SmtpSettings> options)
    {
        _settings = options.Value;
    }

    public async Task SendAsync(string targetAddress, string topic, string htmlBody, CancellationToken cancellationToken)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.Email, _settings.Email));
        message.To.Add(new MailboxAddress(targetAddress, targetAddress));
        message.Subject = topic;

        message.Body = new TextPart("html") { Text = htmlBody };
        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.Server, _settings.Port, SecureSocketOptions.StartTls, cancellationToken);
        await client.AuthenticateAsync(_settings.Login, _settings.Password, cancellationToken);
        await client.SendAsync(message, cancellationToken);
        await client.DisconnectAsync(true, cancellationToken);
    }
}
