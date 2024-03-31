namespace Ebay.Server.Pages.Shared;

public class _Statistics
{
    public int TotalCount { get; }
    public Dictionary<string, int> ConditionDistribution { get; }

    public _Statistics(int totalCount,  Dictionary<string, int> conditionDistribution)
    {
        TotalCount = totalCount;
        ConditionDistribution = conditionDistribution;
    }
}