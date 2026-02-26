namespace Server.Application.Abstractions.Driven.Abstractions.Services;

public interface IEmailGateway
{
    Task SendAsync(string targetAddress, string topic, string messageText);
}
