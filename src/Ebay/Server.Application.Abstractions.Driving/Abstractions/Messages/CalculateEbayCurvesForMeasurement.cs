namespace Server.Application.Abstractions.Driving.Abstractions.Messages;

/// <summary>
/// Запрос на прогрев кеша eBay-графиков и описания лампы для замера.
/// </summary>
public record CalculateEbayCurvesForMeasurement(string MeasurementId);
