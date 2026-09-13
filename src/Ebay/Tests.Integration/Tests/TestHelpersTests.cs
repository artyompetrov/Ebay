using AwesomeAssertions;
using NUnit.Framework.Internal;

namespace Tests.Integration.Tests;

[TestFixture]
[TestOf(typeof(TestHelpers))]
public sealed class TestHelpersTests
{
    [Test]
    public async Task RetryUntilValidationSuccessAsync_DoesNotRetainEarlierAssertionFailures()
    {
        var attempts = 0;
        await TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            attempts++;
            // Exercise NUnit itself: catching this exception alone poisons the test result.
            Assert.That(attempts, Is.GreaterThan(1));
            return Task.CompletedTask;
        });
        attempts.Should().Be(2);
    }

    [Test]
    public async Task RetryUntilValidationSuccessAsync_ReportsPermanentFailure()
    {
        const int TimeoutSeconds = 1;
        using var isolated = new TestExecutionContext.IsolatedContext();
        var action = () => TestHelpers.RetryUntilValidationSuccessAsync(static () =>
        {
            Assert.Fail("Still stale");
            return Task.CompletedTask;
        }, TimeoutSeconds);
        await action.Should().ThrowAsync<AssertionException>().WithMessage("*Still stale*");
    }

    [Test]
    public async Task RetryUntilValidationSuccessAsync_DoesNotRetryUnexpectedExceptions()
    {
        var attempts = 0;
        var action = () => TestHelpers.RetryUntilValidationSuccessAsync(() =>
        {
            attempts++;
            throw new InvalidOperationException("Broken request");
        });
        await action.Should().ThrowAsync<InvalidOperationException>();
        attempts.Should().Be(1);
    }
}
