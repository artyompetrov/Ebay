using Microsoft.Extensions.DependencyInjection;
using Server.Application.Controllers;
using Server.Controllers.Generated;

namespace Server.Adapters.ChipFind;

public static class ServiceCollectionExtensions
{
    public static void AddChipFindAdapter(
        this IServiceCollection services)
    {
        services.AddScoped<IEbayController, EbayControllerImplementation>();
    }
}