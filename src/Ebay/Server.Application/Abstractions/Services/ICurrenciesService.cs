using Server.Domain;

namespace Server.Application.Abstractions.Services;

public interface ICurrenciesService
{
    Task<ICollection<Currency>> GetCurrencies();
}