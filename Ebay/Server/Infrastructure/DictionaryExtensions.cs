namespace Ebay.Server.Infrastructure;

internal static class DictionaryExtensions
{
    public static void AppendOrCreateNewCollection<TKey, TValue, TCollection>(
        this IDictionary<TKey, TCollection> dictionary,
        TKey key,
        TValue value)
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
                });
        }
    }
}