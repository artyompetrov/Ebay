namespace Ebay.Server.Services;

[Flags]
internal enum ExtractFrom
{
    Title = 1,
    ConditionDescription = 2,
    Description = 4
}