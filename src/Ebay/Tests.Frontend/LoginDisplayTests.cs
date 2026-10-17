using AwesomeAssertions;
using Bunit;
using Client.Shared;
using NUnit.Framework;
using Tests.Shared;

namespace Tests.Frontend;

[TestFixture]
[TestOf(typeof(LoginDisplay))]
public sealed class LoginDisplayTests
{
    [Test]
    [OpenSpecScenario("user-accounts", "UI offers no way to register", "Frontend menu has no registration link")]
    public async Task AnonymousUser_SeesLogInLink_AndNoRegisterLink()
    {
        await using var context = new BunitContext();
        context.AddAuthorization();

        var component = context.Render<LoginDisplay>();

        var links = component.FindAll("a");
        links.Select(static a => a.TextContent.Trim()).Should().Equal("Log in");
        links.Select(static a => a.GetAttribute("href")).Should().NotContain(static href => href != null && href.Contains("register"));
    }
}
