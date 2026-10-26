using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using Server.Adapters.Driving.BackgroundTasks;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Currencies;
using Tests.Unit.Fakes;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(DefaultCurrenciesHostedService))]
public sealed class DefaultCurrenciesHostedServiceTests
{
    [Test]
    public async Task StartAsync_DatabaseUnavailable_LogsErrorAndDoesNotStopStartup()
    {
        var logger = new RecordingLogger<DefaultCurrenciesHostedService>();
        var service = new DefaultCurrenciesHostedService(
            new DefaultCurrencyService(
                NullLogger<DefaultCurrencyService>.Instance,
                new InMemoryCurrencyRepository(),
                new FailingUnitOfWorkFactory()),
            logger);

        var start = () => service.StartAsync(CancellationToken.None);

        await start.Should().NotThrowAsync();
        logger.HasErrorContaining("Default currencies were not added").Should().BeTrue();
    }

    private sealed class FailingUnitOfWorkFactory : IWriteModelUnitOfWorkFactory
    {
        public async Task<IWriteModelUnitOfWork> BeginAsync(CancellationToken cancellationToken)
        {
            await Task.Yield();
            throw new InvalidOperationException("database unavailable");
        }
    }
}
