using System.Text.RegularExpressions;

namespace Ebay.Server.Services;

internal record struct Extractor(Regex Regex, int? Result, int Multiplier, ExtractFrom ExtractFrom);