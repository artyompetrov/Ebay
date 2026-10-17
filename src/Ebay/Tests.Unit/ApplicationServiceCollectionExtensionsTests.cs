using Microsoft.Extensions.DependencyInjection;
using Server.Application;
using Server.Application.LotForSale;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ServiceCollectionExtensions))]
public sealed class ApplicationServiceCollectionExtensionsTests
{
    [Test]
    public void AddApplication_RegistersLotForSaleIdGenerator_AsSingleton()
    {
        var services = new ServiceCollection();

        services.AddApplication();

        var descriptor = services.Single(x => x.ServiceType == typeof(ILotForSaleIdGenerator));

        Assert.That(descriptor.Lifetime, Is.EqualTo(ServiceLifetime.Singleton));
    }

    [Test]
    public void AddApplication_RegistersEveryServiceAsSingleton()
    {
        var services = new ServiceCollection();

        services.AddApplication();

        var nonSingletons = services
            .Where(static x => x.Lifetime != ServiceLifetime.Singleton)
            .Select(static x => x.ServiceType.FullName)
            .ToArray();

        Assert.That(nonSingletons, Is.Empty);
    }
}
