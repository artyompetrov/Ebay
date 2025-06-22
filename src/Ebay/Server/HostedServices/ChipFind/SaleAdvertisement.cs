namespace Server.HostedServices.ChipFind;

public record SaleAdvertisement(string Title, string Seller, DateTime Date, Uri Link, string[] Items);