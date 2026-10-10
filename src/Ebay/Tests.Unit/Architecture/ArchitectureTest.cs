using System.Reflection;
using AwesomeAssertions;
using Microsoft.Extensions.Hosting;
using Server.Application;
using Server.Domain;

namespace Tests.Unit.Architecture;

/// <summary>
/// Контроль архитектуры "порты и адаптеры": корневая сборка - только composition root,
/// application и domain не зависят от внешних сборок (кроме явного списка исключений).
/// </summary>
[TestFixture]
public sealed class ArchitectureTest
{
    private const string SolutionAssemblyPrefix = "Server";
    private const string PlatformAssemblyName = "Server.Platform";

    private static readonly string[] FrameworkAssemblyPrefixes =
    [
        "System",
        "netstandard",
        "mscorlib",
        "Microsoft.CSharp",
        "Microsoft.Win32"
    ];

    // Корень на Sdk.Web: AspNetCore и Microsoft.Extensions - часть фреймворка.
    private static readonly string[] RootFrameworkAssemblyPrefixes =
    [
        ..FrameworkAssemblyPrefixes,
        "Microsoft.AspNetCore",
        "Microsoft.Extensions"
    ];

    // TODO: исключения ниже - текущие нарушения; со временем сокращать список, а не расширять.
    // Исключения: допустимые внешние сборки в корне (composition root).
    // Сборки, на которые ссылается сам Server.Platform, разрешаются автоматически (см. GetPlatformReferences).
    private static readonly string[] RootAllowedExternalAssemblies = [
        "Duende.IdentityServer",
        "Duende.IdentityServer.Storage",
        "MassTransit",
        "MassTransit.Abstractions",
        "MassTransit.EntityFrameworkCoreIntegration",
        "MassTransit.SqlTransport.PostgreSql"
    ];

    // Исключения: допустимые внешние сборки в слое application.
    // Слой мягче domain: допустимы абстракции и библиотеки, помогающие оркестрировать сценарии.
    // Конкретная инфраструктура (БД, web-фреймворк, брокер, SMTP, HTTP-клиенты) остаётся в адаптерах за портами.
    // Проверка для ревьюера: замена БД, web-фреймворка или брокера сообщений не должна менять application.
    private static readonly string[] ApplicationAllowedExternalAssemblies = [
        "alglib.net",
        "AngleSharp",
        "HtmlSanitizer",
        "MassTransit.Abstractions",
        "Microsoft.Extensions.Caching.Abstractions",
        "Microsoft.Extensions.Configuration.Binder",
        "Microsoft.Extensions.DependencyInjection.Abstractions",
        "Microsoft.Extensions.Hosting.Abstractions",
        "Microsoft.Extensions.Logging.Abstractions",
        "Microsoft.Extensions.Options",
        "Microsoft.Extensions.Options.ConfigurationExtensions",
        "Microsoft.Extensions.Options.DataAnnotations",
        "Microsoft.Extensions.Primitives",
        "ScottPlot"
    ];

    // Исключения: допустимые внешние сборки в слое domain.
    // Самый строгий слой: по умолчанию - только базовая библиотека.
    // Исключение допустимо лишь для небольшой стабильной библиотеки без побочных эффектов,
    // которая помогает выразить бизнес-модель; фреймворки, диктующие форму модели, недопустимы.
    // Проверка для ревьюера: замена БД, web-фреймворка или брокера сообщений не должна менять domain.
    private static readonly string[] DomainAllowedExternalAssemblies = [
        "JetBrains.Annotations"
    ];

    // Исключения: hosted services, которые пока живут не в адаптерной сборке.
    private static readonly string[] AllowedHostedServiceTypes = [
        "Server.Application.HostedServices.ChipFind.ChipfindBackgroundTask",
        "Server.Application.HostedServices.Currencies.CurrencyRateBackgroundTask",
        "Server.Application.HostedServices.DbCache.DbCacheCleanupHostedService",
        "Server.Application.HostedServices.MeasurementPhotoOriginalSizeBackfillHostedService",
        "Server.Application.HostedServices.Measurements.MeasurementPlotWarmupHostedService",
        "Server.Application.HostedServices.SaleAdvertisements.SaleAdvertisementCleanupBackgroundTask"
    ];

    private static readonly Assembly RootAssembly = typeof(Server.Program).Assembly;
    private static readonly Assembly ApplicationAssembly = typeof(ServiceCollectionExtensions).Assembly;
    private static readonly Assembly DomainAssembly = typeof(Lot).Assembly;

    [Test]
    public void Root_assembly_should_reference_only_solution_assemblies_and_platform()
    {
        var violations = GetExternalReferences(
            RootAssembly,
            [.. RootFrameworkAssemblyPrefixes, SolutionAssemblyPrefix],
            [.. RootAllowedExternalAssemblies, .. GetPlatformReferences()]);

        violations.Should().BeEmpty("корневая сборка не должна зависеть от внешних сборок, кроме Server.Platform");
    }

    [Test]
    public void Application_assembly_should_reference_only_allowed_external_assemblies()
    {
        var violations = GetExternalReferences(
            ApplicationAssembly,
            [.. FrameworkAssemblyPrefixes, SolutionAssemblyPrefix],
            ApplicationAllowedExternalAssemblies);

        violations.Should().BeEmpty("application не должен зависеть от внешних сборок, кроме списка исключений");
    }

    [Test]
    public void Domain_assembly_should_reference_only_allowed_external_assemblies()
    {
        var violations = GetExternalReferences(
            DomainAssembly,
            [.. FrameworkAssemblyPrefixes, SolutionAssemblyPrefix],
            DomainAllowedExternalAssemblies);

        violations.Should().BeEmpty("domain не должен зависеть от внешних сборок, кроме списка исключений");
    }

    [TestCaseSource(nameof(NonAdapterAssemblies))]
    public void Non_adapter_assembly_should_not_contain_hosted_services(Assembly assembly)
    {
        var hostedServices = assembly.GetTypes()
            .Where(static type => !type.IsAbstract && typeof(IHostedService).IsAssignableFrom(type))
            .Select(static type => type.FullName!)
            .Where(static name => !AllowedHostedServiceTypes.Contains(name))
            .Order()
            .ToArray();

        hostedServices.Should().BeEmpty("hosted services - это адаптеры, их место в адаптерных сборках");
    }

    private static IEnumerable<TestCaseData> NonAdapterAssemblies()
    {
        yield return new TestCaseData(RootAssembly).SetArgDisplayNames(nameof(RootAssembly));
        yield return new TestCaseData(ApplicationAssembly).SetArgDisplayNames(nameof(ApplicationAssembly));
        yield return new TestCaseData(DomainAssembly).SetArgDisplayNames(nameof(DomainAssembly));
    }

    // Типы зависимостей Server.Platform попадают в метаданные корня через сигнатуры его API
    // (например, TracerProviderBuilder из OpenTelemetry.Api), поэтому такие ссылки не считаются нарушением.
    private static string[] GetPlatformReferences() =>
        [.. RootAssembly.GetReferencedAssemblies()
            .Where(static reference => reference.Name == PlatformAssemblyName)
            .SelectMany(static reference => Assembly.Load(reference).GetReferencedAssemblies())
            .Select(static reference => reference.Name!)
            .Distinct()];

    private static string[] GetExternalReferences(
        Assembly assembly,
        IReadOnlyCollection<string> allowedPrefixes,
        IReadOnlyCollection<string> allowedExternalAssemblies) =>
        [.. assembly.GetReferencedAssemblies()
            .Select(static reference => reference.Name!)
            .Where(name => !IsAllowed(name, allowedPrefixes, allowedExternalAssemblies))
            .Order()];

    private static bool IsAllowed(
        string assemblyName,
        IReadOnlyCollection<string> allowedPrefixes,
        IReadOnlyCollection<string> allowedExternalAssemblies) =>
        allowedExternalAssemblies.Contains(assemblyName)
        || allowedPrefixes.Any(prefix =>
            assemblyName == prefix || assemblyName.StartsWith(prefix + ".", StringComparison.Ordinal));
}
