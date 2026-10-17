using Server.Application.Abstractions.Driven.Abstractions;

namespace Tests.Unit.Fakes;

/// <summary>
/// Фейк фабрики Unit of Work: на каждый вызов возвращает один и тот же фейковый Unit of Work, чтобы тест мог
/// проверить сохранения и транзакции, выполненные сценарием, и что сценарий передаёт его во все порты.
/// </summary>
internal sealed class SingleUnitOfWorkFactory : IWriteModelUnitOfWorkFactory
{
    private readonly IWriteModelUnitOfWork _unitOfWork;

    public SingleUnitOfWorkFactory(IWriteModelUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public int BeginCallCount { get; private set; }

    public Task<IWriteModelUnitOfWork> BeginAsync(CancellationToken cancellationToken)
    {
        BeginCallCount++;
        return Task.FromResult(_unitOfWork);
    }
}
