using Server.Application.New.Services;

namespace Server.Application.Services.BackgroundProcessing;

public class EbayBackgroundTaskSettings : IBackgroundTaskSettings
{
    private readonly EbayServerOptions _options;

    public EbayBackgroundTaskSettings(EbayServerOptions options)
    {
        _options = options;
    }

    public bool IsLocalRun => _options.IsLocalRun;

    public string TargetEmail => _options.TargetEmail;
}
