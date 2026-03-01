using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Server.Application.HostedServices.ChipFind;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace Server.Adapters.Driven.Smtp;

public class EmailSender : IEmailSender
{
    private readonly SmtpSettings _settings;

    public EmailSender(IOptions<SmtpSettings> options)
    {
        _settings = options.Value;
    }

    public async Task Send(string targetAddress, string topic, string messageText)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(_settings.Email, _settings.Email));
        message.To.Add(new MailboxAddress(targetAddress, targetAddress));
        message.Subject = topic;

        message.Body = new TextPart("html") { Text = messageText };
        using var client = new SmtpClient();
        await client.ConnectAsync(_settings.Server, _settings.Port, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(_settings.Login, _settings.Password);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }
}