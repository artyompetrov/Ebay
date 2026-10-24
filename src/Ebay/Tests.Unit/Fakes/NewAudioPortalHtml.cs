namespace Tests.Unit.Fakes;

/// <summary>
/// Минимальная разметка страниц newaudioportal.com (Invision Community) в той же структуре, что и на сайте
/// (см. фикстуры в Fixtures/NewAudioPortal).
/// </summary>
internal static class NewAudioPortalHtml
{
    public const string BaseUrl = "https://newaudioportal.com";

    public static string TopicHref(long id) => $"{BaseUrl}/topic/{id}-радиолампы/";

    public static string TopicRow(long id, string? lastPost, string? href = null) => $"""
        <li class="ipsDataItem ipsDataItem_responsivePhoto" data-rowID='{id}' data-controller='forums.front.forum.topicRow'>
            <div class='ipsDataItem_main'>
                <h4 class='ipsDataItem_title ipsContained_container'>
                    <span class='ipsType_break ipsContained'><a href='{href ?? TopicHref(id)}' title='Радиолампы'><span>Радиолампы</span></a></span>
                </h4>
                <div class='ipsDataItem_meta ipsType_reset ipsType_light ipsType_blendLinks'>
                    <span>By <a href='{BaseUrl}/profile/738-катана/'>Катана</a></span><time datetime='2026-03-18T15:11:39Z'>March 18</time>
                </div>
            </div>
            <ul class='ipsDataItem_lastPoster ipsDataItem_withPhoto ipsType_blendLinks'>
                <li class="ipsType_light">{(lastPost is null ? "" : $"<time datetime='{lastPost}'>recently</time>")}</li>
            </ul>
        </li>
        """;

    public static string SectionPage(params string[] rows) => $"""
        <html><body>
        <ol class='ipsClear ipsDataList cForumTopicTable cTopicList' data-role='tableRows' data-tableID='topics'>
        {string.Join("\n", rows)}
        </ol>
        </body></html>
        """;

    public static string Post(long id, string? authorId, string authorName, string time, string body)
    {
        var author = authorId is null
            ? authorName
            : $"<a href='{BaseUrl}/profile/{authorId}-{authorName}/' rel=\"nofollow\" class=\"ipsType_break\">{authorName}</a>";

        return $"""
            <article id='elComment_{id}' class='cPost ipsBox ipsComment ipsComment_parent'>
                <aside class='ipsComment_author cAuthorPane ipsColumn'>
                    <h3 class='ipsType_sectionHead cAuthorPane_author ipsType_blendLinks ipsType_break'><strong>{author}</strong></h3>
                </aside>
                <div class='ipsColumn ipsColumn_fluid'>
                    <div id='comment-{id}_wrap' class='ipsComment_content ipsType_medium'>
                        <div class='ipsComment_meta ipsType_light'>
                            <div class='ipsType_reset'>Posted <time datetime='{time}'>recently</time></div>
                        </div>
                        <div class='cPost_contentWrap'>
                            <div data-role='commentContent' class='ipsType_normal ipsType_richText'>{body}</div>
                        </div>
                    </div>
                </div>
            </article>
            """;
    }

    public static string Quote(string author, string text) => $"""
        <blockquote class="ipsQuote" data-ipsquote="" data-ipsquote-username="{author}">
            <div class="ipsQuote_citation">В 28.04.2026 в 11:04, {author} сказал:</div>
            <div class="ipsQuote_contents"><p>{text}</p></div>
        </blockquote>
        """;

    public static string EditNotice(string text) =>
        $"<span class='ipsType_reset ipsType_medium ipsType_light' data-excludeQuote><strong>{text}</strong></span>";

    public static string TopicPage(string title, int pageCount, params string[] posts)
    {
        var pagination = pageCount > 1
            ? $"<ul class='ipsPagination' id='elPagination' data-ipsPagination-pages=\"{pageCount}\" data-pages='{pageCount}'></ul>"
            : "";

        return $"""
            <html><body>
            <h1 class='ipsType_pageTitle ipsContained_container'><span class='ipsType_break ipsContained'><span>{title}</span></span></h1>
            {pagination}
            <div data-role='recommendedComments'></div>
            <div id='elPostFeed' data-role='commentFeed' data-controller='core.front.core.commentFeed'>
            {string.Join("\n", posts)}
            </div>
            </body></html>
            """;
    }

    public static string ReadFixture(string name) =>
        File.ReadAllText(Path.Combine(TestContext.CurrentContext.TestDirectory, "Fixtures", "NewAudioPortal", name));
}
