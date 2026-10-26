namespace Client.Telemetry;

/// <summary>
/// Base of every routed page: all its lifecycle steps are exported, and the first render after a step that started
/// inside a navigation ends that navigation's root span (see <see cref="TracedComponentBase"/>).
/// </summary>
public abstract class TracedPageBase : TracedComponentBase
{
    private protected override bool IsPage => true;
}
