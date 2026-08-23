using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Application.Infrastructure;
using Server.Application.Services.LotDataExtractor;
using Server.Domain;

namespace Server.Application.Consumers.PriceCalculator;

public record CalculatePricesForLot(long LotId);