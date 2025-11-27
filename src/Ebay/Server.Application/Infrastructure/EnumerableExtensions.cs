namespace Server.Application.Infrastructure;

public static class EnumerableExtensions
{
    public static IEnumerable<IEnumerable<T>> Batch<T>(this IEnumerable<T> source, int size)
    {
        ArgumentNullException.ThrowIfNull(source);
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(size);

        using var enumerator = source.GetEnumerator();
        while (enumerator.MoveNext())
        {
            var batch = new List<T>(size) { enumerator.Current };

            while (batch.Count < size && enumerator.MoveNext())
            {
                batch.Add(enumerator.Current);
            }

            yield return batch;
        }
    }
}