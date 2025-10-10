using System.Transactions;

namespace Server.Application.Infrastructure;

internal static class TransactionScopeFactory
{
    // todo считается устаревшим подходом, надо отказаться
    public static TransactionScope Create(IsolationLevel isolationLevel = IsolationLevel.ReadCommitted) =>
        new(
            scopeOption: TransactionScopeOption.Required,
            asyncFlowOption: TransactionScopeAsyncFlowOption.Enabled,
            transactionOptions: new TransactionOptions
            { IsolationLevel = isolationLevel }
        );
}