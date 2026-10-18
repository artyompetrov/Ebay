namespace Tests.Unit.Fakes;

/// <summary>
/// Минимальная разметка страниц qrz.ru в той же структуре, что и на сайте (см. фикстуры в Fixtures/Qrz).
/// </summary>
internal static class QrzHtml
{
    public static string ListEntry(string href, string date) => $"""
        <div class=" adv_row adv_classified">
            <span class="adv_date"><span class="hint">{date}</span></span>
            <div class="adv_content_outer">
                <span class="Title"><a href="{href}">title</a></span>
            </div>
        </div>
        """;

    public static string ListPage(params string[] entries) =>
        $"""<html><body><div class="items">{string.Join("\n", entries)}</div></body></html>""";

    public static string ListingPage(string title, string? author, string? profileHref, params string[] lines)
    {
        var authorBlock = author is null
            ? ""
            : $"""<strong>Автор:</strong> {author}<br>Рейтинг <a href="{profileHref}" target="_blank">stars</a><br/>""";

        return $"""
            <html><body>
            <h1 style="line-height: 40px;">{title}</h1>
            <div class="adv_settings"><h3>Информация об авторе</h3>{authorBlock}<strong>Город:</strong> Москва <br></div>
            <div class="classified_full_body" style="color:black">
                <dl class="item_params"><dt class="item_param_title">Тип</dt><dd class="item_param_value">Лампы</dd></dl>
                <div style="margin-top: 25px"><p>{string.Join("<br />\n", lines)}</p></div>
                <p style="font-size:16px;"><strong>Телефон: <span id="classified-phone">+7 (926) 75</span></strong></p>
            </div>
            </body></html>
            """;
    }

    public static string ReadFixture(string name) =>
        File.ReadAllText(Path.Combine(TestContext.CurrentContext.TestDirectory, "Fixtures", "Qrz", name));
}
