using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Hosting;

namespace Server.Adapters.Web;

public static class WebApplicationExtensions
{
    public static WebApplication UseWebAdapter(this WebApplication app)
    {
        // Configure the HTTP request pipeline.
        if (app.Environment.IsDevelopment())
        {
            _ = app.UseMigrationsEndPoint();
            app.UseWebAssemblyDebugging();
        }
        else
        {
            _ = app.UseExceptionHandler("/Error");
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            _ = app.UseHsts();
        }

        app.UseHttpsRedirection();
        app.UseBlazorFrameworkFiles();
        app.UseStaticFiles();
        app.UseRouting();
        app.UseResponseCaching();
        app.UseAuthentication();
        app.UseIdentityServer();
        app.UseAuthorization();
        app.MapRazorPages();
        app.MapControllers();
        app.MapFallbackToFile("index.html");
        
        return app;
    }
}