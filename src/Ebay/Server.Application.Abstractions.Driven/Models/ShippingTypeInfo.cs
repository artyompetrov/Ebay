namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// A named shipping method (e.g. "Small packet air") with its per-zone rates.
/// </summary>
public record ShippingTypeInfo(string Name, string Currency, IReadOnlyCollection<ShippingZoneRatesInfo> Rates);
