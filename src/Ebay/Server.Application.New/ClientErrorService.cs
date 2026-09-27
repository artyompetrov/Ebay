using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.Abstractions.Driven.Abstractions.Repositories;
using Server.Domain;

namespace Server.Application.New;

/// <summary>
/// Сервис сценариев сохранения ошибок, сообщённых клиентом.
/// </summary>
public class ClientErrorService
{
    private readonly IWriteModelUnitOfWork _unitOfWork;
    private readonly IClientErrorRepository _clientErrorRepository;

    /// <summary>
    /// Создает сервис сценариев сохранения ошибок, сообщённых клиентом.
    /// </summary>
    public ClientErrorService(IWriteModelUnitOfWork unitOfWork, IClientErrorRepository clientErrorRepository)
    {
        _unitOfWork = unitOfWork;
        _clientErrorRepository = clientErrorRepository;
    }

    /// <summary>
    /// Сохраняет ошибку, сообщённую клиентом.
    /// </summary>
    public async Task SaveErrorAsync(string url, string errorText, CancellationToken cancellationToken)
    {
        await _clientErrorRepository.AddAsync(ClientError.Create(url: url, errorText: errorText), cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}
