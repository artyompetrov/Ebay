using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Server.Adapters.Driving.WebApi.Controllers;

[ApiController]
[Route("chrome_extensions")]
public class ExtensionController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public ExtensionController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet("auth")]
    public IActionResult BrowserExtensionAuthEndpoint()
    {
        var htmlContent = @"
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chrome Extension Auth</title>
        </head>
        <body>
            Chrome extension auth page
        </body>
        </html>";

        return Content(content: htmlContent, contentType: "text/html");
    }

    [HttpGet("{extensionName}.xml")]
    public IActionResult Get(string extensionName)
    {
        var extensionsFolder = GetExtensionsFolder();

        var versionedFiles = GetVersionedFiles(folder: extensionsFolder, extensionName: extensionName).ToList();
        if (versionedFiles.Count == 0)
        {
            return StatusCode(statusCode: 500, value: $"No properly versioned CRX files found for extension '{extensionName}'.");
        }

        var (filePath, latestVersion) = versionedFiles.MaxBy(x => x.Version);

        var crxFileName = Path.GetFileName(filePath);
        var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";

        var crxUrl = $"{baseUrl}/chrome_extensions/download/{crxFileName}";

        var xmlContent = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<gupdate xmlns=""http://www.google.com/update2/response"" protocol=""2.0"">
  <app appid=""{extensionName}"">
    <updatecheck codebase=""{crxUrl}"" version=""{latestVersion}"" />
  </app>
</gupdate>";

        Response.Headers.Append(key: "Cache-Control", value: "no-cache, no-store, must-revalidate");
        Response.Headers.Append(key: "Pragma", value: "no-cache");
        Response.Headers.Append(key: "Expires", value: "0");

        return Content(content: xmlContent, contentType: "application/xml");
    }

    [HttpGet("download/{extensionName}_{version}.crx")]
    public IActionResult Download(string extensionName, string version)
    {
        var extensionsFolder = GetExtensionsFolder();
        if (Version.TryParse(input: version, result: out var parsedVersion))
        {
            var crxFilePath = GetVersionedFiles(folder: extensionsFolder, extensionName: extensionName)
                .SingleOrDefault(x => x.Version == parsedVersion)
                .FilePath;
            return crxFilePath == null
                ? NotFound($"CRX file '{extensionName}_{version}.crx' not found.")
                : PhysicalFile(physicalPath: crxFilePath, contentType: "application/x-chrome-extension", fileDownloadName: $"{extensionName}_{version}.crx");
        }

        return NotFound($"CRX file '{extensionName}_{version}.crx' not found.");
    }

    [HttpGet("download/{extensionName}.zip")]
    public IActionResult DownloadAsZip(string extensionName)
    {
        var extensionsFolder = GetExtensionsFolder();
        var crxFilePath = GetVersionedFiles(folder: extensionsFolder, extensionName: extensionName)
            .OrderByDescending(x => x.Version)
            .FirstOrDefault()
            .FilePath;

        if (crxFilePath == null)
        {
            return NotFound($"CRX file '{extensionName}_*.crx' not found.");
        }

        var memoryStream = new MemoryStream();
        using (var archive = new System.IO.Compression.ZipArchive(stream: memoryStream, mode: System.IO.Compression.ZipArchiveMode.Create, leaveOpen: true))
        {
            var zipEntry = archive.CreateEntry(Path.GetFileName(crxFilePath));
            using var entryStream = zipEntry.Open();
            using var fileStream = new FileStream(path: crxFilePath, mode: FileMode.Open, access: FileAccess.Read);
            fileStream.CopyTo(entryStream);
        }

        _ = memoryStream.Seek(offset: 0, loc: SeekOrigin.Begin);
        var zipFileName = $"{extensionName}.zip";

        Response.Headers.Append(key: "Cache-Control", value: "no-cache, no-store, must-revalidate");
        Response.Headers.Append(key: "Pragma", value: "no-cache");
        Response.Headers.Append(key: "Expires", value: "0");

        return File(fileStream: memoryStream, contentType: "application/zip", fileDownloadName: zipFileName);
    }

    private string GetExtensionsFolder()
    {
        var extensionsFolder = Path.Combine(path1: _env.WebRootPath, path2: "chrome_extensions");
        return !Directory.Exists(extensionsFolder) ? throw new InvalidOperationException("Extensions folder not found.") : extensionsFolder;
    }

    private static IEnumerable<(string FilePath, Version Version)> GetVersionedFiles(string folder, string extensionName)
    {
        var pattern = $"{extensionName}_*.crx";
        var crxFiles = Directory.GetFiles(path: folder, searchPattern: pattern);

        var versionPattern = new Regex(pattern: $@"^{Regex.Escape(extensionName)}_(\d+\.\d+\.\d+\.\d+)\.crx$", options: RegexOptions.IgnoreCase);
        return crxFiles
            .Select(file =>
            {
                var fileName = Path.GetFileName(file);
                var match = versionPattern.Match(fileName);
                return match.Success ? (FilePath: file, Version: Version.Parse(match.Groups[1].Value)) : default;
            })
            .Where(x => x != default);
    }
}
