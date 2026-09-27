namespace Server.Application.Abstractions.Driven.Abstractions;

/// <summary>
/// Порт для отправки писем.
/// </summary>
public interface IEmailSender
{
    Task Send(string targetAddress, string topic, string messageText);
}
