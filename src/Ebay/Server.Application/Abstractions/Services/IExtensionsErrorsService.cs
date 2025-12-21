using Server.Domain.ClientErrors;

namespace Server.Application.Abstractions.Services;

public interface IExtensionsErrorsService
{
    Task SaveError(ClientErrorInfo error, CancellationToken cancellationToken);
}