namespace Server.Domain;

public interface IAuditable
{
    public DateTime CreatedAt { get; set; }
    public DateTime ChangedAt { get; set; }

}