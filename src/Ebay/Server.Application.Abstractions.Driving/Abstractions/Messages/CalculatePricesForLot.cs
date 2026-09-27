namespace Server.Application.Abstractions.Driving.Abstractions.Messages;

// TODO: this record (and CalculatePricesForAll/CalculatePricesForProductRequested/CalculateMetricsForProduct,
// moved here in the same commit) changed MassTransit's default type-based message URN when it moved out of
// Server.Application.Consumers.PriceCalculator. Any durable SQL-transport outbox/inbox record still tagged
// with the old URN at deploy time won't route to the renamed consumer and will sit undelivered. Given this
// app's deploy restarts the whole docker-compose stack (publisher and consumer go down/up together) and these
// are near-instant fire-and-forget triggers rather than scheduled/delayed messages, the realistic exposure is
// small - but if it becomes a problem, either add an explicit MassTransit message-URN alias for the old type
// or drain/purge the outbox tables as a one-time deploy step.

/// <summary>
/// Запрос на расчет цен и выручки для лота.
/// </summary>
public record CalculatePricesForLot(long LotId);
