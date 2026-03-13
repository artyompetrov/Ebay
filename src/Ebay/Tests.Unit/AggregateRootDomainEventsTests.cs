using NUnit.Framework;
using Server.Domain.Abstractions;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(AggregateRoot<>))]
public class AggregateRootDomainEventsTests
{
    [Test]
    public void ClearDomainEvents_RemovesAllPublishedEvents()
    {
        var aggregate = TestAggregate.Create();

        aggregate.MarkUpdated();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(aggregate.HasEvents, Is.True);
            Assert.That(aggregate.GetDomainEvents(), Has.Count.EqualTo(1));
        }

        aggregate.ClearDomainEvents();

        using (Assert.EnterMultipleScope())
        {
            Assert.That(aggregate.HasEvents, Is.False);
            Assert.That(aggregate.GetDomainEvents(), Is.Empty);
        }
    }

    private sealed class TestAggregate : AggregateRoot<Guid>
    {
        private TestAggregate(Guid id) : base(id)
        {
        }

        public static TestAggregate Create() => new(Guid.NewGuid());

        public void MarkUpdated() => AddDomainEvent(new TestDomainEvent());
    }

    private sealed record TestDomainEvent : IDomainEvent;
}
