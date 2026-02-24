using Microsoft.Extensions.DependencyInjection;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.Driven.Smtp;

public static class ServiceCollectionExtensions
{
    public static void AddEmailAdapter(this IServiceCollection services)
    {
        _ = services.AddOptions<SmtpSettings>()
            .BindConfiguration("Smtp")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        _ = services.AddScoped<IEmailSender, EmailSender>();
    }
}