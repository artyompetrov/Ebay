using Server.Application.New.LotForSale;
using Server.Domain.LotForSale;
using Server.Domain.Measurements;

namespace Tests;

[TestFixture]
public sealed class LotForSaleTests
{
    [Test]
    public void Create_AcceptsProvidedId()
    {
        var lot = global::Server.Domain.LotForSale.LotForSale.Create("ABCdef1", "lot", Guid.NewGuid(), ProductState.New);

        Assert.That(lot.Id, Is.EqualTo("ABCdef1"));
    }

    [Test]
    public void Create_Throws_WhenIdLengthIsInvalid()
    {
        Assert.Throws<ArgumentException>(() =>
            _ = global::Server.Domain.LotForSale.LotForSale.Create("short", "lot", Guid.NewGuid(), ProductState.New));
    }

    [Test]
    public void Generator_GeneratesUniqueIds_WhenTimeIsConstant()
    {
        var generator = new LotForSaleIdGenerator(
            new FakeCurrentTimeProvider(new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc)),
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
    public void Generator_IsDeterministic_WithFixedDependencies()
    {
        var now = new DateTime(2026, 2, 1, 0, 0, 0, DateTimeKind.Utc);
        var firstGenerator = new LotForSaleIdGenerator(
            new FakeCurrentTimeProvider(now),
            new DeterministicRandomNumberProvider(42));
        var secondGenerator = new LotForSaleIdGenerator(
            new FakeCurrentTimeProvider(now),
            new DeterministicRandomNumberProvider(42));

        var firstSequence = Enumerable.Range(0, 3).Select(_ => firstGenerator.GenerateNextId()).ToArray();
        var secondSequence = Enumerable.Range(0, 3).Select(_ => secondGenerator.GenerateNextId()).ToArray();

        Assert.That(secondSequence, Is.EqualTo(firstSequence));
    }

    private sealed class FakeCurrentTimeProvider : ICurrentTimeProvider
    {
        public FakeCurrentTimeProvider(DateTime utcNow)
        {
            UtcNow = utcNow;
        }

        public DateTime UtcNow { get; }
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
