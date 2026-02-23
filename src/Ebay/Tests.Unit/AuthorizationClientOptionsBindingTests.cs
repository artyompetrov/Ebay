using Microsoft.Extensions.Configuration;
using NUnit.Framework;
using Server.Configuration;

namespace Tests.Unit;

public class AuthorizationClientOptionsBindingTests
{
    [Test]
    public void BindConfiguration_ShouldMapAllAuthorizationClientValues()
    {
        var data = new Dictionary<string, string?>
        {
            ["AuthorizationClient:DataProtectionKeysDirectory"] = "/tmp/keys",
            ["AuthorizationClient:Domain"] = "localhost",
            ["AuthorizationClient:ClientId"] = "client_id",
            ["AuthorizationClient:Scope"] = "ServerAPI",
            ["AuthorizationClient:ClientSecret"] = "secret"
        };

        var configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(data)
            .Build();

        var options = configuration
            .GetSection(AuthorizationClientOptions.SectionName)
            .Get<AuthorizationClientOptions>();

        Assert.That(options, Is.Not.Null);
        using (Assert.EnterMultipleScope())
        {
            Assert.That(options!.DataProtectionKeysDirectory, Is.EqualTo("/tmp/keys"));
            Assert.That(options.Domain, Is.EqualTo("localhost"));
            Assert.That(options.ClientId, Is.EqualTo("client_id"));
            Assert.That(options.Scope, Is.EqualTo("ServerAPI"));
            Assert.That(options.ClientSecret, Is.EqualTo("secret"));
        }
    }
}
