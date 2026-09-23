using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий агрегата валюты.
/// </summary>
public interface ICurrencyRepository : IRepository<Currency, string>
{
}
