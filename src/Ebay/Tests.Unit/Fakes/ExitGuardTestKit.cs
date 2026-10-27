using System.Net;

namespace Tests.Unit.Fakes;

/// <summary>
/// Общие заготовки тестов пробы прокси и смены IP.
/// </summary>
internal static class ExitGuardTestKit
{
    public const string ChangeIpOkAnswer = """{"status":"ok","new_ip":"10.1.2.3"}""";

    public static ScriptedHandler ChangeIpHandler(TimeProvider time) =>
        new(time, static (_, _, _) => Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = new StringContent(ChangeIpOkAnswer) }));

    /// <summary>
    /// Ждёт завершения вызова и каждый раз, когда ротация встаёт на паузу смены IP, сдвигает время на эту паузу.
    /// Время не двигается во время запросов, поэтому таймаут пробы срабатывает только там, где тест его вызывает.
    /// </summary>
    public static async Task<T> AdvanceUntilDoneAsync<T>(RotationClock clock, Task<T> task)
    {
        while (await Task.WhenAny(task, clock.WaitForDelayAsync()) != task)
        {
            clock.Advance(clock.IpChangeDelay);
        }

        return await task;
    }
}
