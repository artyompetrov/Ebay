namespace Server.Application.Abstractions.Driven.Abstractions.BackgroundTasks;

public interface IEmailGateway
{
    Task SendAsync(string targetAddress, string topic, string messageText);
}
