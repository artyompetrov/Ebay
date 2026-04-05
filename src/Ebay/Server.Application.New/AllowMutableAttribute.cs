namespace Server.Application.New;

/// <summary>
/// Marks a singleton service type as an explicit exception for statelessness checks.
/// </summary>
[AttributeUsage(AttributeTargets.Class, Inherited = false)]
public sealed class AllowMutableAttribute : Attribute
{
    /// <summary>
    /// Initializes a new instance of the <see cref="AllowMutableAttribute"/> class.
    /// </summary>
    /// <param name="reason">A human-readable reason why mutable fields are required.</param>
    public AllowMutableAttribute(string reason)
    {
        Reason = reason;
    }

    /// <summary>
    /// Gets a human-readable reason why mutable fields are required.
    /// </summary>
    public string Reason { get; }
}
