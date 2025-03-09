using MassTransit;

namespace Server.Consumers;

public class HelloConsumer : IConsumer<HelloMessage>
{
    public Task Consume(ConsumeContext<HelloMessage> context)
    {
        Console.WriteLine($"Получено сообщение: {context.Message.Text}");
        return Task.CompletedTask;
    }
}

public record HelloMessage(string Text);