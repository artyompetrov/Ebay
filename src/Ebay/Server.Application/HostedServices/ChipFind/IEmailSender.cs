namespace Server.Application.HostedServices.ChipFind;

public interface IEmailSender
{
    Task Send(string targetAddress, string topic, string messageText);
}
