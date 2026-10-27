using OneOf;
using OneOf.Types;

namespace Server.Adapters.Driven.ScrapingProxy;

/// <summary>
/// Проверяет перед сбором, что сайт открывается через текущий внешний IP прокси, и при необходимости меняет IP.
/// </summary>
public interface IScrapingProxyExitGuard
{
    /// <summary>
    /// Запрашивает <paramref name="probeUri"/> клиентом <paramref name="httpClientName"/> (через прокси) и, пока проба
    /// не пройдёт, меняет внешний IP прокси по ссылке из настроек, не больше заданного числа раз. Без прокси сразу
    /// возвращает успех. Отмена <paramref name="cancellationToken"/> завершает вызов исключением отмены, а не ошибкой.
    /// </summary>
    /// <returns>Успех, если проба прошла; ошибку с причиной последней неудачной пробы, если рабочего IP не нашлось.</returns>
    Task<OneOf<Success, Error<string>>> EnsureWorkingExitAsync(
        string httpClientName,
        Uri probeUri,
        CancellationToken cancellationToken);
}
