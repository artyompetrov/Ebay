using Polly;
using Polly.Timeout;

namespace Tests.Integration;

public static class TestHelpers
{
    public static Task RetryUntilValidationSuccessAsync(
        Func<Task> assertAction,
        int timeout = 20)
    {
        AssertionException? lastAssertion = null;

        var retryPolicy = Policy
            .Handle<AssertionException>()
            .WaitAndRetryForeverAsync(
                sleepDurationProvider: _ => TimeSpan.FromMilliseconds(250),
                onRetry: (exception, _) => lastAssertion = exception as AssertionException);
        var timeoutPolicy = Policy.TimeoutAsync(TimeSpan.FromSeconds(timeout));
        var policy = Policy.WrapAsync(timeoutPolicy, retryPolicy);

        return ExecuteAsync();

        async Task ExecuteAsync()
        {
            try
            {
                await policy.ExecuteAsync(_ => assertAction(), CancellationToken.None);
            }
            catch (TimeoutRejectedException) when (lastAssertion != null)
            {
                Assert.Fail(
                    $"Assertion did not pass in {timeout:F1}s. Last assertion: {lastAssertion.Message}");
            }
        }
    }
}
