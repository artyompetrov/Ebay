using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Provides the reference shipping rate table (by shipping method/zone) used to display shipping
/// options, and a flattened by-destination lookup used to estimate shipping cost for a lot.
/// </summary>
public interface IShippingRatesService
{
    /// <summary>
    /// Key used in <see cref="ShippingRatesDictionary"/> for a rate that applies to any destination
    /// country not listed individually.
    /// </summary>
    const string Worldwide = "Worldwide";

    /// <summary>The full shipping rate table, grouped by shipping method.</summary>
    IReadOnlyCollection<ShippingTypeInfo> ShippingRates { get; }

    /// <summary>
    /// Shipping rates flattened by destination (an ISO 3166-1 alpha-2 country code, or
    /// <see cref="Worldwide"/>), each with its own weight-bracket price list.
    /// </summary>
    IReadOnlyDictionary<string, IReadOnlyList<ShippingRateByWeight>> ShippingRatesDictionary { get; }
}
