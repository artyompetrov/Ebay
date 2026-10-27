using System.Net;
using Microsoft.Extensions.Time.Testing;

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
    /// Двигает поддельное время, пока вызов не завершится: паузы ротации идут по нему.
    /// </summary>
    public static async Task<T> AdvanceUntilDoneAsync<T>(FakeTimeProvider time, Task<T> task)
    {
        var step = TimeSpan.FromSeconds(1);

        while (!task.IsCompleted)
        {
            time.Advance(step);
            await Task.Delay(TimeSpan.FromMilliseconds(1));
        }

        return await task;
    }
}
