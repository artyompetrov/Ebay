namespace Server.Infrastructure;

internal static class DictionaryExtensions
{
    public static void AppendOrCreateNewCollection<TKey, TValue, TCollection>(
        this IDictionary<TKey, TCollection> dictionary,
        TKey key,
        TValue value
    )
        where TCollection : ICollection<TValue>, new()
    {
        if (dictionary.TryGetValue(key: key, value: out var values))
        {
            values.Add(value);
        }
        else
        {
            dictionary.Add(
                key: key,
                value: new TCollection
                {
                    value
                }
            );
        }
    }


    public static TValue GetOrAdd<TKey, TValue>(
        this IDictionary<TKey, TValue> dictionary,
        TKey key,
        Func<TValue> createValue
    )
    {
        if (dictionary.TryGetValue(key: key, value: out var value))
        {
            return value;
        }

        var newValue = createValue();
        dictionary.Add(
            key: key,
            value: createValue()
        );

        return newValue;
    }

    public static TValue GetOrAdd<TKey, TValue>(
        this IDictionary<TKey, TValue> dictionary,
        TKey key,
        TValue newValue
    )
    {
        if (dictionary.TryGetValue(key: key, value: out var value))
        {
            return value;
        }

        dictionary.Add(
            key: key,
            value: newValue
        );

        return newValue;
    }
}