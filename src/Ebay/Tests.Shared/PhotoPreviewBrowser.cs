using System.Collections.Concurrent;
using Microsoft.Playwright;

namespace Tests.Shared;

public static class PhotoPreviewBrowser
{
    private const int ViewportWidth = 1200;
    private const int ViewportHeight = 900;

    public static async Task VerifyAsync(string html, bool deferredFullImage)
    {
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
        foreach (var touch in new[] { false, true })
        {
            await VerifyInteractionAsync(browser, html, deferredFullImage, touch);
        }
    }

    private static async Task VerifyInteractionAsync(IBrowser browser, string html, bool deferredFullImage, bool touch)
    {
        await using var context = await browser.NewContextAsync(new()
        {
            ViewportSize = new() { Width = ViewportWidth, Height = ViewportHeight },
            HasTouch = touch,
            IsMobile = touch
        });
        var requests = new ConcurrentBag<string>();
        await context.RouteAsync("**/*", async route =>
        {
            requests.Add(route.Request.Url);
            if (route.Request.ResourceType is "image")
            {
                await route.FulfillAsync(new()
                {
                    ContentType = "image/svg+xml",
                    Body = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"80\"><rect width=\"120\" height=\"80\" fill=\"blue\"/></svg>"
                });
            }
            else
            {
                await route.AbortAsync();
            }
        });
        var page = await context.NewPageAsync();
        await page.SetContentAsync(html, new() { WaitUntil = WaitUntilState.NetworkIdle });
        var photos = page.Locator(".photo-hover");
        await Assertions.Expect(photos).ToHaveCountAsync(2);
        var selected = photos.Nth(touch ? 1 : 0);
        var thumbnail = selected.Locator(".photo-hover-thumb-label");
        var full = selected.Locator(".photo-hover-full");
        var toggle = selected.Locator(".photo-hover-toggle");
        var thumbnailUrl = await thumbnail.Locator("img").GetAttributeAsync("src")
            ?? throw new InvalidOperationException("Thumbnail source missing.");
        var expectedFullUrl = thumbnailUrl.Replace("/thumbnail/content", "/content", StringComparison.Ordinal);
        if (deferredFullImage)
        {
            var firstBox = await photos.Nth(0).BoundingBoxAsync() ?? throw new InvalidOperationException("First photo hidden.");
            var secondBox = await photos.Nth(1).BoundingBoxAsync() ?? throw new InvalidOperationException("Second photo hidden.");
            if (Math.Abs(firstBox.Y - secondBox.Y) > 1 || secondBox.X <= firstBox.X)
            {
                throw new InvalidOperationException("Photos must be arranged horizontally within the measurement row.");
            }
        }
        await Assertions.Expect(full).ToBeHiddenAsync();
        await Assertions.Expect(thumbnail.Locator("a")).ToHaveCountAsync(0);
        if (deferredFullImage && requests.Any(IsFullImage))
        {
            throw new InvalidOperationException("Full-size content was fetched before interaction.");
        }
        if (!requests.Any(static url => url.Contains("/thumbnail/content", StringComparison.Ordinal)))
        {
            throw new InvalidOperationException("The thumbnail did not load with the page.");
        }
        if (!deferredFullImage)
        {
            await Assertions.Expect(full).ToHaveAttributeAsync("src", expectedFullUrl);
        }
        var originalUrl = page.Url;
        if (touch)
        {
            await thumbnail.TapAsync();
            await Assertions.Expect(toggle).ToBeCheckedAsync();
        }
        else
        {
            await thumbnail.HoverAsync();
        }
        await Assertions.Expect(full).ToBeVisibleAsync();
        await Assertions.Expect(full).ToHaveCSSAsync("position", "fixed");
        await Assertions.Expect(full).ToHaveCSSAsync("top", $"{ViewportHeight / 2}px");
        await Assertions.Expect(full).ToHaveCSSAsync("left", $"{ViewportWidth / 2}px");
        await page.WaitForLoadStateAsync(LoadState.NetworkIdle);
        if (!requests.Contains(expectedFullUrl) ||
            (deferredFullImage && requests.Where(IsFullImage).Any(url => url != expectedFullUrl)))
        {
            throw new InvalidOperationException("Interaction must fetch only the selected photo's full-size endpoint.");
        }
        if (!touch)
        {
            await page.Mouse.MoveAsync(0, 0);
            await Assertions.Expect(full).ToBeHiddenAsync();
            await thumbnail.ClickAsync();
            await Assertions.Expect(toggle).ToBeCheckedAsync();
        }
        await Assertions.Expect(full).ToBeVisibleAsync();
        await Assertions.Expect(selected.Locator(".photo-hover-backdrop")).ToBeVisibleAsync();
        if (touch)
        {
            await selected.Locator(".photo-hover-backdrop").TapAsync(new() { Position = new() { X = 1, Y = 1 } });
        }
        else
        {
            await page.Mouse.ClickAsync(0, 0);
        }
        await Assertions.Expect(toggle).Not.ToBeCheckedAsync();
        await Assertions.Expect(full).ToBeHiddenAsync();
        await Assertions.Expect(selected.Locator(".photo-hover-backdrop")).ToBeHiddenAsync();
        if (page.Url != originalUrl || context.Pages.Count != 1)
        {
            throw new InvalidOperationException("Preview navigated or opened another tab.");
        }
    }

    private static bool IsFullImage(string url) =>
        url.Contains("/photos/", StringComparison.Ordinal) &&
        url.EndsWith("/content", StringComparison.Ordinal) &&
        !url.Contains("/thumbnail/", StringComparison.Ordinal);
}
