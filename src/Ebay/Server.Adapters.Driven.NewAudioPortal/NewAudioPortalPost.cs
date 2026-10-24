namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Сообщение темы.
/// </summary>
/// <param name="Author">Автор; <c>null</c>, если у автора нет ссылки на профиль (например, удалённая учётная запись).</param>
/// <param name="Date">Время публикации.</param>
/// <param name="Lines">Непустые строки текста без цитат и пометок о редактировании.</param>
internal sealed record NewAudioPortalPost(NewAudioPortalAuthor? Author, DateTimeOffset Date, string[] Lines);
