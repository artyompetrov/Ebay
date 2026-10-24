namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Разобранная страница темы.
/// </summary>
/// <param name="Title">Заголовок темы.</param>
/// <param name="PageCount">Число страниц темы.</param>
/// <param name="Posts">Сообщения страницы по порядку.</param>
internal sealed record NewAudioPortalTopicPage(string Title, int PageCount, NewAudioPortalPost[] Posts);
