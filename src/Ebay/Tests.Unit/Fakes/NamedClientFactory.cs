namespace Tests.Unit.Fakes;

/// <summary>
/// Фабрика клиентов, отдающая для каждого имени клиент поверх своего обработчика.
/// </summary>
internal sealed class NamedClientFactory : IHttpClientFactory
{
    private readonly IReadOnlyDictionary<string, HttpMessageHandler> _handlers;

    public NamedClientFactory(IReadOnlyDictionary<string, HttpMessageHandler> handlers)
    {
        _handlers = handlers;
    }

    public HttpClient CreateClient(string name) => new(_handlers[name], disposeHandler: false);
}
