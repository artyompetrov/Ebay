using Server.Domain.Abstractions;

namespace Server.Domain;

/// <summary>
/// Ошибка, сообщённая клиентом (расширением/фронтендом) - запись только на запись, нигде не читается обратно.
/// </summary>
public sealed class ClientError : Entity<Guid>
{
    private ClientError(Guid id, string url, string errorText)
        : base(id)
    {
        Url = url;
        ErrorText = errorText;
    }

    public static ClientError Create(string url, string errorText) => new(Guid.NewGuid(), url, errorText);

    public string Url { get; }

    public string ErrorText { get; }
}
