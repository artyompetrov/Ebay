
namespace Server.Application.New.LotForSale;

/// <summary>
/// Генератор идентификаторов лотов для продажи длиной 7 символов.
/// </summary>
public sealed class LotForSaleIdGenerator : ILotForSaleIdGenerator
{
    private const int IdLength = 7;
    private const string IdAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";
    private const int SequenceBits = 12;
    private const int MaxSequence = (1 << SequenceBits) - 1;
    private const int MaxSecondsSinceEpoch = (1 << (IdLength * 6 - SequenceBits)) - 1;
    private static readonly DateTime IdEpoch = new(2024, 1, 1, 0, 0, 0, DateTimeKind.Utc);

    private readonly Lock _sync = new();
    private readonly ICurrentTimeProvider _currentTimeProvider;
    private readonly IRandomNumberProvider _randomNumberProvider;

    private int _lastGeneratedSecond = -1;
    private int _sequence = MaxSequence;

    /// <summary>
    /// Создает генератор идентификаторов лотов для продажи.
    /// </summary>
    /// <param name="currentTimeProvider">Поставщик текущего UTC-времени.</param>
    /// <param name="randomNumberProvider">Поставщик случайных чисел.</param>
    public LotForSaleIdGenerator(
        ICurrentTimeProvider currentTimeProvider,
        IRandomNumberProvider randomNumberProvider)
    {
        _currentTimeProvider = currentTimeProvider;
        _randomNumberProvider = randomNumberProvider;
    }

    /// <inheritdoc />
    public string GenerateNextId()
    {
        var currentSecond = GetCurrentSecondSinceEpoch();
        ulong value;

        lock (_sync)
        {
            var nextSecond = Math.Max(currentSecond, _lastGeneratedSecond);

            if (nextSecond != _lastGeneratedSecond)
            {
                _lastGeneratedSecond = nextSecond;
                _sequence = _randomNumberProvider.Next(0, MaxSequence + 1);
            }
            else if (_sequence < MaxSequence)
            {
                _sequence++;
            }
            else
            {
                _lastGeneratedSecond = Math.Min(_lastGeneratedSecond + 1, MaxSecondsSinceEpoch);
                _sequence = _randomNumberProvider.Next(0, MaxSequence + 1);
            }

            value = ((ulong)(uint)_lastGeneratedSecond << SequenceBits) | (uint)_sequence;
        }

        return Encode(value);
    }

    private int GetCurrentSecondSinceEpoch()
    {
        return (int)Math.Clamp((long)(_currentTimeProvider.UtcNow - IdEpoch).TotalSeconds, 0, MaxSecondsSinceEpoch);
    }

    private static string Encode(ulong value)
    {
        var idBuffer = new char[IdLength];

        for (var i = IdLength - 1; i >= 0; i--)
        {
            idBuffer[i] = IdAlphabet[(int)(value & 63)];
            value >>= 6;
        }

        return new string(idBuffer);
    }
}