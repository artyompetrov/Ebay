namespace Server.Domain.Abstractions;

public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    DateTime ChangedAt { get; set; }

}