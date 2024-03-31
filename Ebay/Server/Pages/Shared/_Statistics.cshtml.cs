namespace Ebay.Server.Pages.Shared;

public class _Statistics
{
    public int TotalCount { get; }
    public Dictionary<string, int> ConditionDistribution { get; }
    
    public string Graph { get; }

    public _Statistics(int totalCount,  Dictionary<string, int> conditionDistribution, string graph)
    {
        TotalCount = totalCount;
        ConditionDistribution = conditionDistribution;
        Graph = graph;
    }
}