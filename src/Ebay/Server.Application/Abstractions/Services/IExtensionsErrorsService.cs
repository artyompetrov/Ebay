namespace Server.Application.Abstractions.Services;

public interface IExtensionsErrorsService
{
    void SaveError(ClientErrorInfo error, CancellationToken cancellationToken);
}