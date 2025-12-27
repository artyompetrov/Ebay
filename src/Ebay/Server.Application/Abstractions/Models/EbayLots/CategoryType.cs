namespace Server.Application.Abstractions.Models.EbayLots;

public record CategoryType(IReadOnlyCollection<Category> Items, string Type);