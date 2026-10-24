using Microsoft.Extensions.Options;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Domain.SaleAdvertisements;

namespace Server.Adapters.Driven.Smtp;

/// <summary>
/// Доставляет уведомления об объявлениях письмом: рендерит их в HTML и выдерживает паузу после отправки,
/// чтобы не упереться в ограничения SMTP-сервера.
/// </summary>
internal sealed class SaleAdvertisementNotificationAdapter : ISaleAdvertisementNotificationAdapter
{
    private readonly EmailSender _emailSender;
    private readonly TimeSpan _delayAfterEmail;

    public SaleAdvertisementNotificationAdapter(EmailSender emailSender, IOptions<SmtpSettings> options)
    {
        _emailSender = emailSender;
        _delayAfterEmail = options.Value.DelayAfterEmail;
    }

    public async Task SendAsync(string targetEmail, SaleAdvertisementNotification notification, CancellationToken cancellationToken)
    {
        await _emailSender.SendAsync(
            targetAddress: targetEmail,
            topic: SaleAdvertisementNotificationHtml.Subject(notification),
            htmlBody: SaleAdvertisementNotificationHtml.Body(notification),
            cancellationToken: cancellationToken);

        await Task.Delay(_delayAfterEmail, cancellationToken);
    }
}
