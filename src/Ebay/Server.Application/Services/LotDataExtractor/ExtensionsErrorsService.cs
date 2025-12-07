using Server.Application.Abstractions.Services;

namespace Server.Application.Services.LotDataExtractor;

public class ExtensionsErrorsService : IExtensionsErrorsService
{
    public void SaveError(ClientErrorInfo error, CancellationToken cancellationToken)
    {
        _ = _applicationContext.ClientErrors.Add(error.ToDbClientError());
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
    }
}