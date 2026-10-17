using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Application;

/// <summary>
/// Сервис сценариев сохранения ошибок, сообщённых клиентом.
/// </summary>
public class ClientErrorService
{
    private readonly IWriteModelUnitOfWorkFactory _unitOfWorkFactory;
    private readonly IClientErrorRepository _clientErrorRepository;

    /// <summary>
    /// Создает сервис сценариев сохранения ошибок, сообщённых клиентом.
    /// </summary>
    public ClientErrorService(IWriteModelUnitOfWorkFactory unitOfWorkFactory, IClientErrorRepository clientErrorRepository)
    {
        _unitOfWorkFactory = unitOfWorkFactory;
        _clientErrorRepository = clientErrorRepository;
    }

    /// <summary>
    /// Сохраняет ошибку, сообщённую клиентом.
    /// </summary>
    public async Task SaveErrorAsync(string url, string errorText, CancellationToken cancellationToken)
    {
        await using var unitOfWork = await _unitOfWorkFactory.BeginAsync(cancellationToken);

        await _clientErrorRepository.AddAsync(unitOfWork, ClientError.Create(url: url, errorText: errorText), cancellationToken);
        await unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
