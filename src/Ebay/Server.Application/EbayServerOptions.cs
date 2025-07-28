namespace Server.Application;

public class EbayServerOptions
{
    /// <summary>
    /// Отключает функции которые работают только на сервере
    /// </summary>
    public bool IsLocalRun { get; set; } = true;
    
    public string TargetEmail { get; set; } = null!;
}