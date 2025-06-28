using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Server.Application.Data;
using Server.Application.Infrastructure;

namespace Server.Application.HostedServices.ChipFind;

public class ChipfindBackgroundTask : BackgroundTask
{
    private readonly ILogger<ChipfindBackgroundTask> _logger;
    private readonly IChipfindAdapter _chipfindAdapter;
    private readonly IEmailSender _emailSender;
    private readonly EbayServerOptions _ebayServerOptions;
    private readonly IServiceScopeFactory _serviceScopeFactory;

    public ChipfindBackgroundTask(
        ILogger<ChipfindBackgroundTask> logger,
        IChipfindAdapter chipfindAdapter,
        IEmailSender emailSender,
        EbayServerOptions ebayServerOptions,
        IServiceScopeFactory serviceScopeFactory
    ) : base(logger)
    {
        _logger = logger;
        _chipfindAdapter = chipfindAdapter;
        _emailSender = emailSender;
        _ebayServerOptions = ebayServerOptions;
        _serviceScopeFactory = serviceScopeFactory;
    }

    public override TimeSpan UpdateTime => WellKnown.ChipFind.UpdateTime;
    public override TimeSpan ErrorDelay => WellKnown.ChipFind.ErrorDelay;

    protected async override Task BackgroundTaskImplementation(CancellationToken cancellationToken)
    {
        if (_ebayServerOptions.IsLocalRun) return;

        var recentSales = await _chipfindAdapter.GetRecentSaleAdvertisements(cancellationToken);
        
        foreach (var saleAdvertisement in recentSales)
        {
            try
            {
                await Task.Delay(5000, cancellationToken);
                
                using var scope = _serviceScopeFactory.CreateScope();
                var applicationDbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                
                var emailKey = $"{saleAdvertisement.Link.AbsoluteUri}_{saleAdvertisement.Date}";
                
                using var transaction = TransactionScopeFactory.Create();
                
                var exists = await applicationDbContext.EmailSendHistories
                    .AnyAsync(e => e.EmailId == emailKey, cancellationToken);

                if (exists)
                {
                    // Уже отправлено, пропускаем
                    continue;
                }
                
                applicationDbContext.EmailSendHistories.Add(new EmailSendHistory
                {
                    EmailId = emailKey,
                    CreatedAt = saleAdvertisement.Date
                });

                await applicationDbContext.SaveChangesAsync();

                var emailBody = $"<a href=\"{saleAdvertisement.Link}\">ссылка</a></br>{saleAdvertisement.Body}";
                
                await _emailSender.Send(
                    targetAddress: _ebayServerOptions.TargetEmail,
                    topic: $"{saleAdvertisement.Title} [{saleAdvertisement.Seller}]",
                    messageText: emailBody);
                
                transaction.Complete();
                
            }
            catch (DbUpdateException ex) when (IsUniqueConstraintViolation(ex))
            {
                // Если дубликат — ничего не делаем
            }
        }
    }
    
    private bool IsUniqueConstraintViolation(DbUpdateException ex)
    {
        var isUniqueConstraintViolation = ex.InnerException != null &&
                                          (ex.InnerException.Message.Contains("UNIQUE") ||
                                           ex.InnerException.Message.Contains("duplicate"));
        return isUniqueConstraintViolation;
    }
}