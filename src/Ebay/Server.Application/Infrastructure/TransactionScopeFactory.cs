using System.Transactions;

namespace Server.Application.Infrastructure;

internal static class TransactionScopeFactory
{
    // todo считается устаревшим подходом, надо отказаться
    [Obsolete]
    public static TransactionScope Create(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted)
    {
        return new(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
            { IsolationLevel = isolationLevel }
        );
    }
}