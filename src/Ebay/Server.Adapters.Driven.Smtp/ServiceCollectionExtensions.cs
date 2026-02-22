using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.Driven.Smtp;

public static class ServiceCollectionExtensions
{
    public static void AddEmailAdapter(
        this IServiceCollection services, IConfiguration configuration)
    {
        _ = services.AddOptions<SmtpSettings>()
            .BindConfiguration("Smtp");
        _ = services.AddScoped<IEmailSender, EmailSender>();
    }
}