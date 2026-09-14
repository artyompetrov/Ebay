namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// A destination country as used by the shipping rate table.
/// </summary>
/// <param name="NameRu">Country name in Russian.</param>
/// <param name="ThreeLetterCode">ISO 3166-1 alpha-3 code, used on the shipping rate table page.</param>
/// <param name="TwoLetterCode">ISO 3166-1 alpha-2 code, used in the eBay API.</param>
public record ShippingCountryInfo(string NameRu, string ThreeLetterCode, string TwoLetterCode);
