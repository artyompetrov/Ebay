namespace Server.Domain.Abstractions;

public interface IAuditable
{
    DateTimeOffset CreatedAt { get; set; }
    DateTimeOffset ChangedAt { get; set; }
}