using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;

namespace Server.Adapters.Driven.Smtp;

public static class ServiceCollectionExtensions
{
    public static void AddEmailAdapter(this IServiceCollection services)
    {
        _ = services.AddOptions<SmtpSettings>()
            .BindConfiguration("Smtp")
            .ValidateDataAnnotations()
            .ValidateOnStart();

        _ = services.AddScoped<IEmailGateway, EmailSender>();
    }
}