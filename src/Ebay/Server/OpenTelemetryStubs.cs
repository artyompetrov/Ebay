using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace OpenTelemetry
{
    using OpenTelemetry.Resources;
    using OpenTelemetry.Trace;

    public static class ServiceCollectionExtensions
    {
        public static OpenTelemetryBuilder AddOpenTelemetry(this IServiceCollection services)
        {
            _ = services;
            return new OpenTelemetryBuilder();
        }
    }

    public sealed class OpenTelemetryBuilder
    {
        public OpenTelemetryBuilder ConfigureResource(Action<ResourceBuilder> configure)
        {
            configure(new ResourceBuilder());
            return this;
        }

        public OpenTelemetryBuilder WithTracing(Action<TracerProviderBuilder> configure)
        {
            configure(new TracerProviderBuilder());
            return this;
        }
    }
}

namespace OpenTelemetry.Trace
{
    public sealed class TracerProviderBuilder
    {
        public TracerProviderBuilder AddAspNetCoreInstrumentation() => this;
        public TracerProviderBuilder AddHttpClientInstrumentation() => this;
        public TracerProviderBuilder AddOtlpExporter() => this;
    }
}

namespace OpenTelemetry.Resources
{
    public sealed class ResourceBuilder
    {
        public static ResourceBuilder CreateDefault() => new();

        public ResourceBuilder AddService(string serviceName)
        {
            _ = serviceName;
            return this;
        }
    }
}

namespace OpenTelemetry.Logs
{
    using OpenTelemetry.Resources;

    public sealed class OpenTelemetryLoggerOptions
    {
        public bool IncludeScopes { get; set; }
        public bool IncludeFormattedMessage { get; set; }
        public bool ParseStateValues { get; set; }
        public bool IncludeTraceContext { get; set; }

        public OpenTelemetryLoggerOptions SetResourceBuilder(ResourceBuilder builder)
        {
            _ = builder;
            return this;
        }

        public OpenTelemetryLoggerOptions AddOtlpExporter() => this;
    }

    public static class LoggingBuilderExtensions
    {
        public static ILoggingBuilder AddOpenTelemetry(this ILoggingBuilder builder, Action<OpenTelemetryLoggerOptions> configure)
        {
            configure(new OpenTelemetryLoggerOptions());
            return builder;
        }
    }
}
