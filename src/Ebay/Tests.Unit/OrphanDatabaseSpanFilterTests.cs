using System.Diagnostics;
using AwesomeAssertions;
using Server.Platform.Tracing;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(OrphanDatabaseSpanFilter))]
public sealed class OrphanDatabaseSpanFilterTests
{
    private const string OtherSourceName = $"{nameof(OrphanDatabaseSpanFilterTests)}.Other";

    private static readonly ActivitySource DatabaseSource = new(OrphanDatabaseSpanFilter.DatabaseSourceName);
    private static readonly ActivitySource OtherSource = new(OtherSourceName);

    [Test]
    public void OnStart_DatabaseSpanWithoutParent_IsNotRecorded()
    {
        using var listener = ListenToTestSources();
        using var filter = new OrphanDatabaseSpanFilter();
        using var activity = StartRequired(DatabaseSource, parent: null);

        filter.OnStart(activity);

        activity.Recorded.Should().BeFalse();
    }

    [Test]
    public void OnStart_DatabaseSpanWithParent_StaysRecorded()
    {
        using var listener = ListenToTestSources();
        using var filter = new OrphanDatabaseSpanFilter();
        using var parent = StartRequired(OtherSource, parent: null);
        using var activity = StartRequired(DatabaseSource, parent.Context);

        filter.OnStart(activity);

        activity.Recorded.Should().BeTrue();
    }

    [Test]
    public void OnStart_OtherSourceSpanWithoutParent_StaysRecorded()
    {
        using var listener = ListenToTestSources();
        using var filter = new OrphanDatabaseSpanFilter();
        using var activity = StartRequired(OtherSource, parent: null);

        filter.OnStart(activity);

        activity.Recorded.Should().BeTrue();
    }

    private static ActivityListener ListenToTestSources()
    {
        var listener = new ActivityListener
        {
            ShouldListenTo = static source => source.Name is OrphanDatabaseSpanFilter.DatabaseSourceName or OtherSourceName,
            Sample = static (ref ActivityCreationOptions<ActivityContext> _) => ActivitySamplingResult.AllDataAndRecorded
        };
        ActivitySource.AddActivityListener(listener);
        return listener;
    }

    private static Activity StartRequired(ActivitySource source, ActivityContext? parent)
    {
        if (parent is { } parentContext)
        {
            return source.StartActivity("operation", ActivityKind.Internal, parentContext)
                ?? throw new InvalidOperationException("The listener samples this source, so the activity must be created.");
        }

        // A default parent context means "use Activity.Current", so clear it to get a root activity.
        Activity.Current = null;
        return source.StartActivity("operation")
            ?? throw new InvalidOperationException("The listener samples this source, so the activity must be created.");
    }
}
