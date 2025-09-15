namespace Server.Application.Infrastructure;

public static class EnumerableExtensions
{
    public static IEnumerable<IEnumerable<T>> Batch<T>(this IEnumerable<T> source, int size)
    {
        if (source == null) throw new ArgumentNullException(nameof(source));
        if (size <= 0) throw new ArgumentOutOfRangeException(nameof(size));

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