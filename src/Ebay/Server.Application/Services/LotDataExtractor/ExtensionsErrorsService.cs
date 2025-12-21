using Server.Application.Abstractions;
using Server.Application.Abstractions.Repositories;
using Server.Application.Abstractions.Services;
using Server.Domain.ClientErrors;

namespace Server.Application.Services.LotDataExtractor;

internal class ExtensionsErrorsService : IExtensionsErrorsService
{
    private readonly IClientErrorInfoRepository _clientErrorInfoRepository;
    private readonly IUnitOfWork _unitOfWork;

    public ExtensionsErrorsService(IClientErrorInfoRepository  clientErrorInfoRepository, IUnitOfWork  unitOfWork)
    {
        _clientErrorInfoRepository = clientErrorInfoRepository;
        _unitOfWork = unitOfWork;
    }
    
    public async Task SaveError(ClientErrorInfo error, CancellationToken cancellationToken)
    {
        await _clientErrorInfoRepository.SaveAsync(error, cancellationToken);
        
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }
}