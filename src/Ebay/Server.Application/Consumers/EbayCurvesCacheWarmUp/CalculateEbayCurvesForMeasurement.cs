using MassTransit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Server.Application.Services.MeasurementPlot;

namespace Server.Application.Consumers.EbayCurvesCacheWarmUp;

public record CalculateEbayCurvesForMeasurement(string MeasurementId);