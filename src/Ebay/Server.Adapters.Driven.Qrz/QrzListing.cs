namespace Server.Adapters.Driven.Qrz;

/// <summary>
/// Объявление из списка категории: то, что видно без захода на страницу объявления.
/// </summary>
internal sealed record QrzListing(long Id, Uri Link, DateTimeOffset Date);
