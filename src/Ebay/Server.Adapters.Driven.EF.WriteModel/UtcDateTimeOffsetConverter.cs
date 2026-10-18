using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Server.Adapters.Driven.EF.WriteModel;

/// <summary>
/// Записывает <see cref="DateTimeOffset"/> в UTC: тот же момент времени, но со смещением 0, которое требует Npgsql
/// для <c>timestamp with time zone</c>. Читается значение как есть (PostgreSQL возвращает его в UTC).
/// </summary>
internal sealed class UtcDateTimeOffsetConverter : ValueConverter<DateTimeOffset, DateTimeOffset>
{
    public UtcDateTimeOffsetConverter()
        : base(static value => value.ToUniversalTime(), static value => value)
    {
    }
}
