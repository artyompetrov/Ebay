using Server.Application.New.LotForSale;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(LotForSaleIdGenerator))]
public sealed class LotForSaleIdGeneratorTests
{
    private static readonly DateTimeOffset IdEpoch = new(2024, 1, 1, 0, 0, 0, TimeSpan.Zero);
    private const int SequenceBits = 12;
    private const int MaxSequence = (1 << SequenceBits) - 1;
    private const int MaxSecondsSinceEpoch = (1 << (7 * 6 - SequenceBits)) - 1;
    private const string IdAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

    [Test]
    public void GenerateNextId_GeneratesUniqueIds_WhenTimeIsConstant()
    {
        var generator = new LotForSaleIdGenerator(
            new QueueCurrentTimeProvider(Enumerable.Repeat(new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero), 5_000)),
            new DeterministicRandomNumberProvider(0));

        var ids = Enumerable.Range(0, 5_000)
            .Select(_ => generator.GenerateNextId())
            .ToList();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(ids.Distinct().Count(), Is.EqualTo(ids.Count));
            Assert.That(ids.All(id => id.Length == 7), Is.True);
        }
    }

    [Test]
    public void GenerateNextId_IsDeterministic_WithFixedDependencies()
    {
        var now = new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero);
        var firstGenerator = new LotForSaleIdGenerator(
            new QueueCurrentTimeProvider(Enumerable.Repeat(now, 3)),
            new DeterministicRandomNumberProvider(42));
        var secondGenerator = new LotForSaleIdGenerator(
            new QueueCurrentTimeProvider(Enumerable.Repeat(now, 3)),
            new DeterministicRandomNumberProvider(42));

        var firstSequence = Enumerable.Range(0, 3).Select(_ => firstGenerator.GenerateNextId()).ToArray();
        var secondSequence = Enumerable.Range(0, 3).Select(_ => secondGenerator.GenerateNextId()).ToArray();

        Assert.That(secondSequence, Is.EqualTo(firstSequence));
    }

    [Test]
    public void GenerateNextId_UsesLastGeneratedSecond_WhenClockMovesBackwards()
    {
        var firstTime = new DateTimeOffset(2026, 2, 1, 12, 0, 10, TimeSpan.Zero);
        var secondTime = firstTime.AddSeconds(-5);
        var generator = new LotForSaleIdGenerator(
            new QueueCurrentTimeProvider([firstTime, secondTime]),
            new DeterministicRandomNumberProvider(100));

        var firstId = generator.GenerateNextId();
        var secondId = generator.GenerateNextId();
        var (firstSeconds, firstSequence) = Decode(firstId);
        var (secondSeconds, secondSequence) = Decode(secondId);

        using (Assert.EnterMultipleScope())
        {
            Assert.That(secondSeconds, Is.EqualTo(firstSeconds));
            Assert.That(secondSequence, Is.EqualTo(firstSequence + 1));
        }
    }

    [Test]
    public void GenerateNextId_AdvancesSecond_WhenSequenceIsExhaustedInSameSecond()
    {
        var now = new DateTimeOffset(2026, 2, 1, 0, 0, 0, TimeSpan.Zero);
        var generator = new LotForSaleIdGenerator(
            new QueueCurrentTimeProvider(Enumerable.Repeat(now, 2)),
            new DeterministicRandomNumberProvider(MaxSequence));

        var firstId = generator.GenerateNextId();
        var secondId = generator.GenerateNextId();
        var (firstSeconds, firstSequence) = Decode(firstId);
        var (secondSeconds, secondSequence) = Decode(secondId);

        using (Assert.EnterMultipleScope())
        {
            Assert.That(firstSequence, Is.EqualTo(MaxSequence));
            Assert.That(secondSeconds, Is.EqualTo(firstSeconds + 1));
            Assert.That(secondSequence, Is.EqualTo(MaxSequence));
        }
    }

    [Test]
    public void GenerateNextId_ClampsTimeOutsideSupportedRange()
    {
        var beforeEpoch = IdEpoch.AddMinutes(-1);
        var afterRange = IdEpoch.AddSeconds(MaxSecondsSinceEpoch + 10L);
        var generator = new LotForSaleIdGenerator(
            new QueueCurrentTimeProvider([beforeEpoch, afterRange]),
            new DeterministicRandomNumberProvider(1));

        var firstId = generator.GenerateNextId();
        var secondId = generator.GenerateNextId();
        var (firstSeconds, _) = Decode(firstId);
        var (secondSeconds, _) = Decode(secondId);

        using (Assert.EnterMultipleScope())
        {
            Assert.That(firstSeconds, Is.Zero);
            Assert.That(secondSeconds, Is.EqualTo(MaxSecondsSinceEpoch));
        }
    }

    private static (int SecondsSinceEpoch, int Sequence) Decode(string id)
    {
        ulong value = 0;
        foreach (var symbol in id)
        {
            value = (value << 6) | (uint)IdAlphabet.IndexOf(symbol);
        }

        return ((int)(value >> SequenceBits), (int)(value & MaxSequence));
    }

    private sealed class QueueCurrentTimeProvider : ICurrentTimeProvider
    {
        private readonly Queue<DateTimeOffset> _timestamps;

        public QueueCurrentTimeProvider(IEnumerable<DateTimeOffset> timestamps)
        {
            _timestamps = new Queue<DateTimeOffset>(timestamps);
        }

        public DateTimeOffset UtcNow => _timestamps.Count > 0
            ? _timestamps.Dequeue()
            : throw new InvalidOperationException("No timestamps left in queue.");
    }

    private sealed class DeterministicRandomNumberProvider : IRandomNumberProvider
    {
        private readonly int _value;

        public DeterministicRandomNumberProvider(int value)
        {
            _value = value;
        }

        public int Next(int minInclusive, int maxExclusive)
        {
            return Math.Clamp(_value, minInclusive, maxExclusive - 1);
        }
    }
}