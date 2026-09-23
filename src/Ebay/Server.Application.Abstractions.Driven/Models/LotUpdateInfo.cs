namespace Server.Application.Abstractions.Driven.Models;

/// <summary>
/// Идентификатор лота и дата его последнего обновления.
/// </summary>
public record LotUpdateInfo(long Id, DateTimeOffset UpdateDate);
