using Microsoft.AspNetCore.Mvc;

namespace Server.Application.Controllers;

[ApiController]
public class RobotsController : ControllerBase
{
    [HttpGet("/robots.txt")]
    public ContentResult RobotsTxt()
    {
        const string content = "User-agent: *\nDisallow: /";

        return Content(content: content, contentType: "text/plain");
    }
}