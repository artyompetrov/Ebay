using System.Security.Cryptography;

namespace Server.Application.LotForSale;

/// <summary>
/// Системная реализация генератора случайных чисел.
/// </summary>
public sealed class CryptoRandomNumberProvider : IRandomNumberProvider
{
    /// <inheritdoc />
    public int Next(int minInclusive, int maxExclusive)
    {
        return RandomNumberGenerator.GetInt32(minInclusive, maxExclusive);
    }
}