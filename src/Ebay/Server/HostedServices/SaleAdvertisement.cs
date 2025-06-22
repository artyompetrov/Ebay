namespace Server.HostedServices;

public record SaleAdvertisement(string Title, string Seller, DateTime Date, Uri Link, string[] Items);