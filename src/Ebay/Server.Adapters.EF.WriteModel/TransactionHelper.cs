using System.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Server.Application.Data;

namespace Server.Adapters.EF.WriteModel
{
    internal static class TransactionHelper
    {
        public static async Task<TransactionWrapper> EnsureRepeatableReadOrStartAsync(
            ApplicationDbContext dbContext,
            CancellationToken ct)
        {
            // 1) Запрещаем ambient TransactionScope
            if (System.Transactions.Transaction.Current is not null)
            {
                throw new InvalidOperationException("Ambient TransactionScope is not allowed here.");
            }

            var db = dbContext.Database;

            // 2) Если уже есть EF-транзакция — проверяем уровень
            if (db.CurrentTransaction is { } current)
            {
                var iso = current.GetDbTransaction().IsolationLevel;
                return iso is not (IsolationLevel.RepeatableRead or IsolationLevel.Serializable)
                    ? throw new InvalidOperationException(
                        $"Isolation is {iso}; need at least REPEATABLE READ for split-query consistency.")
                    : TransactionWrapper.Existing(current);
            }

            // 3) Открываем соединение (если нужно) и заводим raw-транзакцию с RR
            var connection = db.GetDbConnection();
            if (connection.State != ConnectionState.Open)
            {
                await connection.OpenAsync(ct);
            }

            var rawTx = await connection.BeginTransactionAsync(IsolationLevel.RepeatableRead, ct);

            // 4) Подкладываем её EF Core — используем перегрузку, которая возвращает IDbContextTransaction?
            var efTx = await db.UseTransactionAsync(rawTx, ct)
                       ?? throw new InvalidOperationException("EF did not attach to the provided transaction.");

            return TransactionWrapper.Owned(efTx);
        }

        public readonly struct TransactionWrapper : IAsyncDisposable
        {
            private readonly IDbContextTransaction? _owned;

            private TransactionWrapper(IDbContextTransaction? owned)
            {
                _owned = owned;
            }

            public static TransactionWrapper Owned(IDbContextTransaction tx) => new(tx);

            public static TransactionWrapper Existing(IDbContextTransaction _) => new(null);

            public async ValueTask CommitIfOwnedAsync(CancellationToken ct)
            {
                if (_owned is not null)
                {
                    await _owned.CommitAsync(ct);
                }
            }

            public async ValueTask DisposeAsync()
            {
                if (_owned is not null)
                {
                    await _owned.DisposeAsync();
                }
            }
        }
    }
}