using Microsoft.Extensions.DependencyInjection;
using Server.Domain.Measurements;

namespace Server.Adapters.uTracer;

public static class ServiceCollectionExtensions
{
    public static void AddUTracerAdapter(
        this IServiceCollection services) => _ = services.AddScoped<IMeasurementFileParser, MeasurementFileParser>();
}
