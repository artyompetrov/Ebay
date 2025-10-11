using Server.Application.Abstractions.Measurements;

namespace Sever.Adapters.EF.ReadModel.ReadModelSchema;

public class PassportQueries : IPassportQueries
{
    
    public async Task<IReadOnlyList<Passport>> GetPassports(Guid productId, CancellationToken cancellationToken)
    {
        
        
        throw new NotImplementedException();
    }
}