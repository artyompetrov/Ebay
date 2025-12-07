namespace Server.Application.Services.LotDataExtractor;

public record LotDataToExtract(string Name, string Condition, string? ConditionDescription, string DescriptionText, string? ShortDescription, int? LotSize);