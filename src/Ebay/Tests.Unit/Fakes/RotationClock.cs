using System.Threading.Channels;
using Microsoft.Extensions.Time.Testing;

namespace Tests.Unit.Fakes;

/// <summary>
/// Поддельное время, которое сообщает о каждом запуске паузы ротации (таймер со сроком, равным паузе смены IP),
/// чтобы тест двигал время ровно тогда, когда ротация ждёт, а не наугад во время запроса.
/// </summary>
internal sealed class RotationClock : FakeTimeProvider
{
    private readonly Channel<TimeSpan> _delaysStarted = Channel.CreateUnbounded<TimeSpan>();

    public RotationClock(TimeSpan ipChangeDelay)
    {
        IpChangeDelay = ipChangeDelay;
    }

    public TimeSpan IpChangeDelay { get; }

    public override ITimer CreateTimer(TimerCallback callback, object? state, TimeSpan dueTime, TimeSpan period)
    {
        var timer = base.CreateTimer(callback, state, dueTime, period);

        if (dueTime == IpChangeDelay)
        {
            _delaysStarted.Writer.TryWrite(dueTime);
        }

        return timer;
    }

    /// <summary>
    /// Ждёт начала следующей (ещё не дождавшейся) паузы ротации.
    /// </summary>
    public Task WaitForDelayAsync() => _delaysStarted.Reader.ReadAsync().AsTask();
}
