namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Фабрика Unit of Work для write-model. Сервисы приложения - синглтоны и не держат контекст БД в полях:
/// каждая операция записи открывает собственный <see cref="IWriteModelUnitOfWork"/> и передаёт его явно
/// во все репозитории и издатели, участвующие в одной атомарной операции.
/// </summary>
public interface IWriteModelUnitOfWorkFactory
{
    /// <summary>
    /// Открывает новый Unit of Work.
    /// </summary>
    /// <param name="cancellationToken">Токен отмены операции.</param>
    /// <returns>Unit of Work, который вызывающий код обязан освободить.</returns>
    Task<IWriteModelUnitOfWork> BeginAsync(CancellationToken cancellationToken);
}
