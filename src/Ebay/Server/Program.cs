using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Options;
using Server.Adapters.Driven.ChipFind;
using Server.Adapters.Driven.EF.Identity;
using Server.Adapters.Driven.EF.ReadModel;
using Server.Adapters.Driven.EF.WriteModel;
using Server.Adapters.Driven.GeoIp;
using Server.Adapters.Driven.ImageProcessing;
using Server.Adapters.Driven.OpenExchangeRates;
using Server.Adapters.Driven.Plotting;
using Server.Adapters.Driven.Smtp;
using Server.Adapters.Driven.uTracer;
using Server.Adapters.Driving.BackgroundTasks;
using Server.Adapters.MassTransit;
using Server.Adapters.Driving.WebApi;
using Server.Application;
using Server.Platform;

namespace Server;

public class Program
{
    public static void Main(string[] args)
    {

        //IdentityModelEventSource.ShowPII = true;

        var builder = WebApplication.CreateBuilder(args);
        builder.AddPlatform();

        // Add services to the container.
        // Каждый потребитель IMemoryCache получает свой именованный кеш вместо одного общего
        // service-wide экземпляра - так лимит размера одного кеша не задевает записи в другом.
        builder.Services.AddKeyedSingleton<IMemoryCache>(
            Application.WellKnown.ImageCache.ServiceKey,
            (sp, _) => new MemoryCache(new MemoryCacheOptions
            {
                SizeLimit = sp.GetRequiredService<IOptions<ImageCacheOptions>>().Value.SizeLimitBytes
            }));
        builder.Services.AddEmailAdapter();
        builder.Services.AddUTracerAdapter();
        builder.Services.AddImageProcessingAdapter();
        builder.Services.AddGeoIpAdapter();
        builder.Services.AddChipFindAdapter();
        builder.Services.AddOpenExchangeRatesAdapter();
        builder.Services.AddPlottingAdapter();
        builder.Services.AddEfReadModelAdapter();
        builder.Services.AddApplication();
        builder.Services.AddDatabaseDeveloperPageExceptionFilter();
        builder.Services.AddWebApiAdapter();
        builder.Services.AddEfWriteModelAdapter();
        builder.Services.AddEfIdentityAdapter();
        builder.Services.AddMassTransitAdapter();
        builder.Services.AddBackgroundTasksAdapter();

        builder.Services.AddResponseCaching();

        var app = builder.Build();

        app.Services.UseEfIdentityAdapter();
        app.Services.UseEfWriteModelAdapter();

        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            app.UseMigrationsEndPoint();
            app.UseWebAssemblyDebugging();
        }
        else
        {
            app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseBlazorFrameworkFiles();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseResponseCaching();

        app.UseEfIdentityAdapterAuthentication();

        app.MapRazorPages();
        app.MapControllers();
        app.MapPlatform();
        app.MapFallbackToFile("index.html");

        app.Run();
    }

}