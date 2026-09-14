namespace Server.Application.New.LotDataExtractor;

/// <summary>
/// Plain-text fields of an eBay lot listing, used to guess candidate condition/pcs/test-state
/// category values from free text.
/// </summary>
public sealed record LotTextFields(
    string Name,
    string Condition,
    string DescriptionText,
    string? ConditionDescription,
    string? ShortDescription,
    int? LotSize
);