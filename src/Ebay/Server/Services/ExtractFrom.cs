namespace Server.Services;

[Flags]
internal enum ExtractFrom
{
    Title = 1,
    ConditionDescription = 2,
    Description = 4,
    Condition = 8,
    ShortDescription = 16
}