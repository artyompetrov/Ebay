namespace Server.Domain.Exceptions;

/// <summary>
/// класс доменной модели.
/// </summary>
public class DomainException : Exception
{
    /// <summary>
    /// операция.
    /// </summary>
    public DomainException(string message)
        : base(message)
    {
    }
}
