namespace Server.Domain.ClientErrors;

public class ClientErrorInfo : AggregateRoot<string>
{
    internal ClientErrorInfo(string id) : base(id)
    {
    }
}