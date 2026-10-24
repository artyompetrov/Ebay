using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.Smtp;

public static class ServiceCollectionExtensions
{
    public static void AddEmailAdapter(this IServiceCollection services)
    {
        services.AddOptions<SmtpSettings>()
            .BindConfiguration(SmtpSettings.SectionName)
            .ValidateDataAnnotations()
            .ValidateOnStart();

        services.AddSingleton<EmailSender>();
        services.AddSingleton<ISaleAdvertisementNotificationAdapter, SaleAdvertisementNotificationAdapter>();

        // MailKit creates its span source and meters only after these calls; the platform exports them by name.
        MailKit.Telemetry.SmtpClient.Configure();
        MailKit.Telemetry.Socket.Configure();
    }
}
