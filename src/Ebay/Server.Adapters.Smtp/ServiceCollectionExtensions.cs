
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Application.HostedServices.ChipFind;

namespace Server.Adapters.Smtp;

public static class ServiceCollectionExtensions
{
    public static void AddEmailAdapter(
        this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<SmtpSettings>(configuration.GetSection("Smtp"));
        services.AddSingleton<IEmailSender, EmailSender>();
    }
}