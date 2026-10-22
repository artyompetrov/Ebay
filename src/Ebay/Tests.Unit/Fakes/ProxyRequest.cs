namespace Tests.Unit.Fakes;

/// <summary>
/// Запрос, полученный <see cref="StubProxy"/>: стартовая строка и значение <c>Proxy-Authorization</c>.
/// </summary>
internal sealed record ProxyRequest(string RequestLine, string? ProxyAuthorization);
