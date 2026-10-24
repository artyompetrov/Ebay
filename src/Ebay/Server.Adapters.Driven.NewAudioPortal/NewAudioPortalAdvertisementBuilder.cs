using Microsoft.Extensions.Logging;
using Server.Application.Abstractions.Driven.Models;

namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Собирает объявление автора темы из прочитанных страниц: заголовок темы и строки его сообщений.
/// </summary>
internal static class NewAudioPortalAdvertisementBuilder
{
    /// <summary>
    /// Возвращает объявление темы или <c>null</c>, если у первого сообщения нет автора с профилем.
    /// </summary>
    /// <param name="topic">Тема из списка раздела.</param>
    /// <param name="pages">Прочитанные страницы темы по порядку, первая страница - первой.</param>
    /// <param name="logger">Логгер для предупреждений о пропущенной теме.</param>
    public static SaleAdvertisement? TryBuild(NewAudioPortalTopicRow topic, IReadOnlyList<NewAudioPortalTopicPage> pages, ILogger logger)
    {
        var firstPage = pages[0];
        var starter = firstPage.Posts.FirstOrDefault()?.Author;

        if (starter is null)
        {
            logger.LogWarning("Skipping newaudioportal.com topic {TopicId}: the opening post has no author profile link", topic.Id);
            return null;
        }

        // Автор сравнивается по id профиля: ник можно сменить.
        var starterPosts = pages
            .SelectMany(static x => x.Posts)
            .Where(x => x.Author?.Id == starter.Id)
            .ToArray();

        return new SaleAdvertisement(
            Title: firstPage.Title,
            SellerKey: starter.Id,
            SellerName: starter.Name.Length > 0 ? starter.Name : starter.Id,
            Date: starterPosts.Max(static x => x.Date),
            Link: topic.Link,
            Items: [firstPage.Title, .. starterPosts.SelectMany(static x => x.Lines)]);
    }
}
