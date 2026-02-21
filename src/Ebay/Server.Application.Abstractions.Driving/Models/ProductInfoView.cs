using System.Text.RegularExpressions;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driving.Models;

public record ProductInfoView(
    ProductInfo ProductInfo,
    bool IsCheckRequired,
    int CalculatedEbayWeight,
    Regex ProductRegex,
    bool IsInteresting
    );