using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions.Driven.Abstractions;

namespace Server.Adapters.Driven.Plotting;

public static class ServiceCollectionExtensions
{
    public static void AddPlottingAdapter(this IServiceCollection services)
    {
        services.AddSingleton<IPlottingAdapter, PlottingAdapter>();
    }
}
