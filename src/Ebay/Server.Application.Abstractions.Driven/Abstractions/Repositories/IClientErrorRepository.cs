using Server.Domain;

namespace Server.Application.Abstractions.Driven.Abstractions.Repositories;

/// <summary>
/// Репозиторий ошибок, сообщённых клиентом.
/// </summary>
public interface IClientErrorRepository
{
    Task AddAsync(IWriteModelUnitOfWork unitOfWork, ClientError error, CancellationToken cancellationToken);
}
