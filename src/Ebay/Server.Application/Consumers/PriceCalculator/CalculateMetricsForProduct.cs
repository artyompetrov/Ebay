using MassTransit;
using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Queries;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;
using Server.Domain.Measurements;

namespace Server.Application.Consumers.PriceCalculator;

public record CalculateMetricsForProduct(Guid ProductId);
