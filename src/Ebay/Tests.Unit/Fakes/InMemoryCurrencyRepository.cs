using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Tests.Unit.Fakes;

/// <summary>
/// Фейк репозитория валют: хранит агрегаты в словаре по идентификатору.
/// </summary>
internal sealed class InMemoryCurrencyRepository : ICurrencyRepository
{
    private readonly Dictionary<string, Currency> _currencies;

    public InMemoryCurrencyRepository(params Currency[] currencies)
    {
        _currencies = currencies.ToDictionary(static x => x.Id);
    }

    public IReadOnlyDictionary<string, Currency> Currencies => _currencies;

    public Task<Currency?> GetByIdAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken) =>
        Task.FromResult(_currencies.GetValueOrDefault(id));

    public Task AddAsync(IWriteModelUnitOfWork unitOfWork, Currency aggregate, CancellationToken cancellationToken)
    {
        _currencies.Add(aggregate.Id, aggregate);
        return Task.CompletedTask;
    }

    public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, string id, CancellationToken cancellationToken) => throw new NotSupportedException();

    public Task RemoveAsync(IWriteModelUnitOfWork unitOfWork, IReadOnlySet<string> id, CancellationToken cancellationToken) => throw new NotSupportedException();
}
