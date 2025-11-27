using System.Net;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using Server.Adapters.ChipFind;
using Server.Application.HostedServices.ChipFind;

namespace Tests;

[TestFixture]
public class ChipfindAdapterTests
{
    [Test]
    public async Task Parse_PreFormattedItems_DoesNotLogWarning()
    {
        var xml = """
<rss><channel><item>
<title>Продаю Краны ГА162/Т и ГА231 и др в З/У ( Недорого ) [СЕРГЕЙ]</title>
<description><![CDATA[ +++++++++++++++++++<br /> <pre>Кран ГА140 ( ГА-140 ) в З/У + Пасп. 1991 г. 13 шт. 14 500,0 руб.</pre><pre>Кран ГА140 ( ГА-140 ) в З/У + Пасп. 1991 г. 6 шт. 14 500,0 руб.</pre><pre>Кран ГА142/1 ( ГА-142/1 ) в З/У + Пасп. 1991 г. 5 шт. 13 700,0 руб.</pre><pre>Кран ГА142/2 ( ГА-142/2 ) в З/У + Пасп. 1991 г. 9 шт. 10 500,0 руб.</pre><pre>Кран ГА142/2 ( ГА-142/2 ) в З/У + Пасп. 1991 г. 6 шт. 10 500,0 руб.</pre><pre>Кран ГА144 ( ГА-144 ) в З/У + Пасп. 1991 г. 3 шт. 14 500,0 руб.</pre><pre>Кран ГА158 ( ГА-158 ) Ручной Регулятор Газа в З/У + Пасп. 1996 г. 1 шт. 10 400,0 руб.</pre><pre>Кран ГА162/Т ( ГА-162/Т ) Ручной Регулятор Газа в З/У + Пасп. 1997 г. 11 шт. 6 400,0 руб.</pre><pre>Кран ГА162/Т ( ГА-162/Т ) Ручной Регулятор Газа в З/У + Пасп. 85-86 г. 22 шт. 6 400,0 руб.</pre><pre>Кран ГА164М/2 ( ГА-164М/2 ) Электром. Кран с Гидрозамком в З/У + Пасп. 1991 г. 8 шт. 23 000,0 руб.</pre><pre>Кран ГА164М/2 ( ГА-164М/2 ) Электром. Кран с Гидрозамком в З/У + Пасп. 1991 г. 6 шт. 23 000,0 руб.</pre><pre>Кран ГА164М/2 ( ГА-164М/2 ) Электром. Кран с Гидрозамком в З/У + Пасп. 1991 г. 5 шт. 23 000,0 руб.</pre><pre>Кран ГА231 ( ГА-231 ) Ручной Регулятор Газа в З/У + Пасп. 1991 г. 22 шт. 7 200,0 руб.</pre><pre>Кран КР-6 Клапан Распределительный в З/У + Пасп. 1991 г. 7 шт. 18 500,0 руб.</pre><br /> <br /> +++++++++++++++++++<br /> Фото по Запросу.<br /> Будем Рады Вашей Заявке.<br /> С ув. Сергей.<br /> ++++++++++++++++++ ]]></description>
<pubDate>Sun, 31 Aug 2025 17:48:04 +0300</pubDate>
<link>http://example.com/1</link>
<guid>1</guid>
</item></channel></rss>
""";

        var handler = new StaticMessageHandler(xml);
        var httpClient = new HttpClient(handler);
        var factory = new TestHttpClientFactory(httpClient);
        var logger = new TestLogger<ChipfindAdapter>();
        var adapter = new ChipfindAdapter(logger, factory, new MemoryCache(new MemoryCacheOptions()), new ChipFindAdapterOptions(0));

        var ads = await adapter.GetRecentSaleAdvertisements(CancellationToken.None);
        Assert.That(ads, Has.Count.EqualTo(1));
        var ad = ads.Single();
        using (Assert.EnterMultipleScope())
        {
            Assert.That(ad.Items, Has.Length.EqualTo(20));
            Assert.That(logger.HasWarning, Is.False);
        }
    }

    [Test]
    public async Task Parse_MixedPreAndLines_DoesNotLogWarning()
    {
        var xml = """
<rss><channel><item>
<title>ткд пке продам [Петровский Павел Олегович]</title>
<description><![CDATA[ <pre>ПКЕ52ПОДГ 1989 7</pre><pre>ПКЕ52ПОДГ 2001 3</pre><pre>ПКЕ54ПОДГ 1989 1</pre><pre>ПКЕ54ПОДГ 2000 1</pre><pre>ПКЕ54ПОДГБ 1990 1</pre><pre>ПКЕ56ПОДГ 1989 3</pre><pre>ПКЕ56ПОДГБ 1989 2</pre><pre>РНЕ44 27В 2009 2</pre><pre>РНЕ66 24В 5</pre><br /> ТКД501ДОД<br /> ТКД501ОДЛ<br /> ТКД503ОДЛ<br /> ТКД511ДОД<br /> ТКД201ОДГ ]]></description>
<pubDate>Sun, 31 Aug 2025 19:22:26 +0300</pubDate>
<link>http://example.com/2</link>
<guid>2</guid>
</item></channel></rss>
""";

        var handler = new StaticMessageHandler(xml);
        var httpClient = new HttpClient(handler);
        var factory = new TestHttpClientFactory(httpClient);
        var logger = new TestLogger<ChipfindAdapter>();
        var adapter = new ChipfindAdapter(logger, factory, new MemoryCache(new MemoryCacheOptions()), new ChipFindAdapterOptions(0));

        var ads = await adapter.GetRecentSaleAdvertisements(CancellationToken.None);
        var ad = ads.Single();
        using (Assert.EnterMultipleScope())
        {
            Assert.That(ad.Items, Has.Length.EqualTo(14));
            Assert.That(logger.HasWarning, Is.False);
        }
    }

    [Test]
    public async Task Parse_SimpleLines_DoesNotLogWarning()
    {
        var xml = """
<rss><channel><item>
<title>ПРОДАМ: 2РМГД18, ШПЛМ СНЦ23 ВШЛ,РС,ТВШЛ,ШП2-2сер,ШПЛ-О-СБ1 [Абасов М.А]</title>
<description><![CDATA[ ПРОДАМ:Новые соединители по УКРАИНЕ<br /> 2РМГД18б4ш5е2б<br /> 9М3.645.000-1. штепсель,ШПЛ-О-СБ1<br /> 2РМГД18б4ш5е2б<br /> ШПЛМ-2-2сер, ШПЛМ-3-2сер,ШПЛМ-4-2сер<br /> ВШЛ-2-2сер, ВШЛ-3-2сер,ВШЛ-4-2сер<br /> ТВШЛ-2НС-2сер<br /> ШП-5Т,ШП-2Т....<br /> СНЦ23-4/14Р2В<br /> РС-4,РС19, РС-32 роз<br /> РРМ-46-102-1г6в2в<br /> 9М3.645.000-1. штепсель ]]></description>
<pubDate>Sun, 31 Aug 2025 18:12:16 +0300</pubDate>
<link>http://example.com/3</link>
<guid>3</guid>
</item></channel></rss>
""";

        var handler = new StaticMessageHandler(xml);
        var httpClient = new HttpClient(handler);
        var factory = new TestHttpClientFactory(httpClient);
        var logger = new TestLogger<ChipfindAdapter>();
        var adapter = new ChipfindAdapter(logger, factory, new MemoryCache(new MemoryCacheOptions()), new ChipFindAdapterOptions(0));

        var ads = await adapter.GetRecentSaleAdvertisements(CancellationToken.None);
        var ad = ads.Single();
        using (Assert.EnterMultipleScope())
        {
            Assert.That(ad.Items, Has.Length.EqualTo(12));
            Assert.That(logger.HasWarning, Is.False);
        }
    }

    [Test]
    public async Task TryGetAdvertisementContactAsync_WhenContactContainsMailto_ReturnsPlainTextContact()
    {
        const string html = """
<html><body>
<div class="contact">E-mail:<a href="mailto:info.post47@yandex.ru?subject=Re:%20%CF%F0%EE%E4%E0%EC">info.post47@yandex.ru</a></div>
</body></html>
""";

        var handler = new StaticMessageHandler(html);
        var httpClient = new HttpClient(handler);
        var factory = new TestHttpClientFactory(httpClient);
        var logger = new TestLogger<ChipfindAdapter>();
        var adapter = new ChipfindAdapter(logger, factory, new MemoryCache(new MemoryCacheOptions()), new ChipFindAdapterOptions(0));

        var contact = await adapter.TryGetAdvertisementContactAsync(
            saleAdvertisement: new SaleAdvertisement(
                Title: "title",
                Seller: "seller",
                Date: DateTime.MaxValue,
                Link: new Uri("https://www.chipfind.ru/market/msg_prodam_1610251451.htm"),
                Items: [""],
                Body: ""),
            CancellationToken.None);

        Assert.That(contact, Is.EqualTo("E-mail:info.post47@yandex.ru"));
    }

    [Test]
    public async Task TryGetAdvertisementContactAsync_WhenMailtoLinkPresentWithoutSubject_ReturnsContact()
    {
        const string html = """
                        <html><body>
                        <div class="contact">E-mail:<a href="mailto:info.post47@yandex.ru">info.post47@yandex.ru</a></div>
                        </body></html>
                        """;

        var handler = new StaticMessageHandler(html);
        var httpClient = new HttpClient(handler);
        var factory = new TestHttpClientFactory(httpClient);
        var logger = new TestLogger<ChipfindAdapter>();
        var adapter = new ChipfindAdapter(logger, factory, new MemoryCache(new MemoryCacheOptions()), new ChipFindAdapterOptions(0));

        var contact = await adapter.TryGetAdvertisementContactAsync(
            saleAdvertisement: new SaleAdvertisement(
                Title: "title",
                Seller: "seller",
                Date: DateTime.MaxValue,
                Link: new Uri("https://www.chipfind.ru/market/msg_prodam_1610251451.htm"),
                Items: [""],
                Body: ""),
            CancellationToken.None);

        Assert.That(contact, Is.EqualTo("E-mail:info.post47@yandex.ru"));
    }

    [Test]
    public async Task TryGetAdvertisemenContactAsync_WhenMailtoLinkMissing_ReturnsPlainTextContact()
    {
        const string html = """
<html><body>
<div class="contact">Телефон: +7 (000) 000-00-00</div>
</body></html>
""";

        var handler = new StaticMessageHandler(html);
        var httpClient = new HttpClient(handler);
        var factory = new TestHttpClientFactory(httpClient);
        var logger = new TestLogger<ChipfindAdapter>();
        var adapter = new ChipfindAdapter(logger, factory, new MemoryCache(new MemoryCacheOptions()), new ChipFindAdapterOptions(0));

        var contact = await adapter.TryGetAdvertisementContactAsync(
            saleAdvertisement: new SaleAdvertisement(
                Title: "title",
                Seller: "seller",
                Date: DateTime.MaxValue,
                Link: new Uri("https://www.chipfind.ru/market/msg_prodam_1610251451.htm"),
                Items: [""],
                Body: ""),
            CancellationToken.None);

        Assert.That(contact, Is.EqualTo("Телефон: +7 (000) 000-00-00"));
    }

    private sealed class StaticMessageHandler(string content) : HttpMessageHandler
    {
        private readonly string _content = content;

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(_content)
            };
            return Task.FromResult(response);
        }
    }

    private sealed class TestHttpClientFactory(HttpClient client) : IHttpClientFactory
    {
        private readonly HttpClient _client = client;

        public HttpClient CreateClient(string name) => _client;
    }

    private sealed class TestLogger<T> : ILogger<T>
    {
        private readonly List<LogLevel> _levels = [];
        public bool HasWarning => _levels.Contains(LogLevel.Warning);

        IDisposable ILogger.BeginScope<TState>(TState state) => NullDisposable.Instance;

        bool ILogger.IsEnabled(LogLevel logLevel) => true;

        void ILogger.Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter) => _levels.Add(logLevel);

        private sealed class NullDisposable : IDisposable
        {
            public static readonly NullDisposable Instance = new();
            public void Dispose() { }
        }
    }
}
