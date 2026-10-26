namespace Client.Telemetry;

/// <summary>Splits pending items into request bodies below the relay limit.</summary>
internal static class TelemetryBatches
{
    /// <summary>The relay rejects bodies above 1 MiB; keep some room below it.</summary>
    public const int MaxBatchBytes = (1024 * 1024) - 1024;

    /// <summary>
    /// Serializes <paramref name="items"/> into bodies of at most <paramref name="maxBytes"/>, halving a batch until it
    /// fits; a single item that is still too large is counted in <c>TooLarge</c> and left out.
    /// </summary>
    public static (IReadOnlyList<SerializedBatch> Batches, int TooLarge) Split<T>(
        IReadOnlyList<T> items, Func<IReadOnlyList<T>, byte[]> serialize, int maxBytes)
    {
        var batches = new List<SerializedBatch>();
        var tooLarge = SplitInto(items, serialize, maxBytes, batches);
        return (batches, tooLarge);
    }

    private static int SplitInto<T>(IReadOnlyList<T> items, Func<IReadOnlyList<T>, byte[]> serialize, int maxBytes, List<SerializedBatch> batches)
    {
        if (items.Count == 0)
        {
            return 0;
        }

        var body = serialize(items);
        if (body.Length <= maxBytes)
        {
            batches.Add(new SerializedBatch(body, items.Count));
            return 0;
        }

        if (items.Count == 1)
        {
            return 1;
        }

        var middle = (items.Count + 1) / 2;
        return SplitInto([.. items.Take(middle)], serialize, maxBytes, batches)
               + SplitInto([.. items.Skip(middle)], serialize, maxBytes, batches);
    }
}
