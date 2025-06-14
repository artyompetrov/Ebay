using System.Transactions;

namespace Server.Infrastructure;

internal static class TransactionScopeFactory
{
    public static TransactionScope Create(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
        new(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
            { IsolationLevel = isolationLevel }
        );
}