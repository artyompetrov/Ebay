namespace Server.Application.HostedServices.ChipFind;

public record SaleAdvertisement(string Title, string Seller, DateTimeOffset Date, Uri Link, string[] Items, string Body);