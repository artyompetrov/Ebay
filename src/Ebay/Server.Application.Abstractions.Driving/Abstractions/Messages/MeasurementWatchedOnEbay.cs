namespace Server.Application.Abstractions.Driving.Abstractions.Messages;

/// <summary>
/// Событие просмотра замера на eBay.
/// </summary>
/// <param name="MeasurementId">Идентификатор замера.</param>
/// <param name="WatchedAtUtc">Момент просмотра в UTC.</param>
public record MeasurementWatchedOnEbay(string MeasurementId, DateTime WatchedAtUtc);