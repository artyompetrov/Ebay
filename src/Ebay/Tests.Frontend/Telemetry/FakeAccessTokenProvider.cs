using Microsoft.AspNetCore.Components.WebAssembly.Authentication;

namespace Tests.Frontend.Telemetry;

internal sealed class FakeAccessTokenProvider : IAccessTokenProvider
{
    public bool HasToken { get; set; } = true;

    public ValueTask<AccessTokenResult> RequestAccessToken() => ValueTask.FromResult(Result());

    public ValueTask<AccessTokenResult> RequestAccessToken(AccessTokenRequestOptions options) => ValueTask.FromResult(Result());

    private AccessTokenResult Result() => HasToken
        ? new AccessTokenResult(AccessTokenResultStatus.Success, new AccessToken { Value = "test-token", Expires = DateTimeOffset.UtcNow.AddHours(1) }, null, null)
        : new AccessTokenResult(AccessTokenResultStatus.RequiresRedirect, new AccessToken(), "authentication/login", null);
}
