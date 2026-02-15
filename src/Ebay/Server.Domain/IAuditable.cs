namespace Server.Domain;

public interface IAuditable
{
    DateTime CreatedAt { get; set; }
    DateTime ChangedAt { get; set; }

}