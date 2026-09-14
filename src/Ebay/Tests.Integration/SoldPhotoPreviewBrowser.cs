using System.Collections.Concurrent;
using System.Net;
using AwesomeAssertions;
using Microsoft.Playwright;

namespace Tests.Integration;

internal static class SoldPhotoPreviewBrowser
{
    internal static async Task VerifyAsync(HttpClient client, string html, string measurementId, Guid photoId, byte[] original)
    {
        var baseAddress = client.BaseAddress ?? throw new InvalidOperationException("Test server address missing.");
        var photoUrl = new Uri(baseAddress, $"/api/webapi/v1/measurements/{measurementId}/photos/{photoId}/").AbsoluteUri;
        using var playwright = await Playwright.CreateAsync();
        await using var browser = await playwright.Chromium.LaunchAsync(new() { Headless = true });
        foreach (var touch in new[] { false, true })
        {
            await using var context = await browser.NewContextAsync(new()
            {
                JavaScriptEnabled = false,
                HasTouch = touch,
                IsMobile = touch,
                ViewportSize = new() { Width = 1200, Height = 900 }
            });
            var images = new ConcurrentDictionary<string, ImageResponse>();
            await context.RouteAsync("**/*", async route =>
            {
                if (route.Request.ResourceType != "image" || new Uri(route.Request.Url).Authority != baseAddress.Authority)
                {
                    await route.AbortAsync();
                    return;
                }

                // Forward browser-selected URLs to the real TestServer, including status, MIME and bytes.
                using var response = await client.GetAsync(route.Request.Url);
                var bytes = await response.Content.ReadAsByteArrayAsync();
                var contentType = response.Content.Headers.ContentType?.MediaType ?? "application/octet-stream";
                images[route.Request.Url] = new(response.StatusCode, contentType, bytes);
                await route.FulfillAsync(new() { Status = (int)response.StatusCode, ContentType = contentType, BodyBytes = bytes });
            });

            var page = await context.NewPageAsync();
            await page.SetContentAsync(html, new() { WaitUntil = WaitUntilState.NetworkIdle });
            var photo = page.Locator(".photo-hover");
            await Assertions.Expect(photo).ToHaveCountAsync(1);
            var thumbnail = photo.Locator(".photo-hover-thumb-label img");
            var full = photo.Locator(".photo-hover-full");
            await Assertions.Expect(thumbnail).ToHaveAttributeAsync("src", photoUrl + "thumbnail/content");
            (await thumbnail.EvaluateAsync<bool>("image => image.complete && image.naturalWidth === 1 && image.naturalHeight === 1"))
                .Should().BeTrue("the thumbnail must display a decoded placeholder, not a real photo or broken image");
            await AssertPlaceholderAsync(page, images, photoUrl + "thumbnail/content", original);
            await Assertions.Expect(full).ToBeHiddenAsync();
            images.Keys.Should().NotContain(photoUrl + "content");

            var label = photo.Locator(".photo-hover-thumb-label");
            if (touch)
            {
                await label.TapAsync();
            }
            else
            {
                await label.HoverAsync();
            }

            await Assertions.Expect(full).ToBeVisibleAsync();
            await Assertions.Expect(full).ToHaveCSSAsync("background-image", $"url(\"{photoUrl}content\")");
            await page.WaitForLoadStateAsync(LoadState.NetworkIdle);
            await AssertPlaceholderAsync(page, images, photoUrl + "content", original);
            images.Values.Should().OnlyContain(image => !image.Bytes.SequenceEqual(original));
            context.Pages.Should().HaveCount(1);
            page.Url.Should().Be("about:blank");
        }
    }

    private static async Task AssertPlaceholderAsync(IPage page, ConcurrentDictionary<string, ImageResponse> images, string url, byte[] original)
    {
        images.Should().ContainKey(url);
        var response = images[url];
        response.Status.Should().Be(HttpStatusCode.OK);
        response.ContentType.Should().Be("image/png");
        response.Bytes.Should().NotEqual(original);
        // Decode the exact HTTP body in Chromium, also validating the CSS background image payload.
        var dimensions = await page.EvaluateAsync<int[]>("""
            async source => {
                const image = new Image();
                image.src = source;
                await image.decode();
                return [image.naturalWidth, image.naturalHeight];
            }
            """, "data:image/png;base64," + Convert.ToBase64String(response.Bytes));
        dimensions.Should().Equal(1, 1);
    }

    private sealed record ImageResponse(HttpStatusCode Status, string ContentType, byte[] Bytes);
}
