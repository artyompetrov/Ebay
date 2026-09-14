namespace Server.Application.New.LotDataExtractor;

/// <summary>
/// The lot listing field a candidate category value was extracted from.
/// </summary>
[Flags]
public enum ExtractFrom
{
    Title = 1,
    ConditionDescription = 2,
    Description = 4,
    Condition = 8,
    ShortDescription = 16,
    LotSize = 32,
}