using MassTransit;
using Server.Application.Abstractions.Driven.Abstractions.Queries;

namespace Server.Application.Consumers.PriceCalculator;
public record CalculatePricesForProductRequested(Guid ProductId);