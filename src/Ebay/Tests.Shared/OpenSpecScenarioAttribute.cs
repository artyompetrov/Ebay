namespace Tests.Shared;

[AttributeUsage(AttributeTargets.Method, AllowMultiple = true)]
public sealed class OpenSpecScenarioAttribute : Attribute
{
    public OpenSpecScenarioAttribute(string specId, string requirement, string scenario)
    {
        SpecId = specId;
        Requirement = requirement;
        Scenario = scenario;
    }

    public string SpecId { get; }

    public string Requirement { get; }

    public string Scenario { get; }
}
