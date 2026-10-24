namespace Server.Adapters.Driven.NewAudioPortal;

/// <summary>
/// Тема из списка раздела: то, что видно без захода в тему.
/// </summary>
internal sealed record NewAudioPortalTopicRow(long Id, Uri Link, DateTimeOffset LastPostDate);
