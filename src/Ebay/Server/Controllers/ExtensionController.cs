using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;

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
        
        return Content(htmlContent, "text/html");
    }
    
    [HttpGet("{extensionName}.xml")]
    public IActionResult Get(string extensionName)
    {
        var extensionsFolder = GetExtensionsFolder();

        var versionedFiles = GetVersionedFiles(extensionsFolder, extensionName).ToList();
        if (!versionedFiles.Any())
        {
            return StatusCode(500, $"No properly versioned CRX files found for extension '{extensionName}'.");
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

        Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
        Response.Headers.Append("Pragma", "no-cache");
        Response.Headers.Append("Expires", "0");

        return Content(xmlContent, "application/xml");
    }
    
    [HttpGet("download/{extensionName}_{version}.crx")]
    public IActionResult Download(string extensionName, string version)
    {
        var extensionsFolder = GetExtensionsFolder();
        if (Version.TryParse(version, out var parsedVersion))
        {
            var crxFilePath = GetVersionedFiles(extensionsFolder, extensionName)
                .SingleOrDefault(x => x.Version == parsedVersion)
                .FilePath;
            if (crxFilePath == null)
            {
                return NotFound($"CRX file '{extensionName}_{version}.crx' not found.");
            }

            return PhysicalFile(crxFilePath, "application/x-chrome-extension", $"{extensionName}_{version}.crx");
        }

        return NotFound($"CRX file '{extensionName}_{version}.crx' not found.");
    }
    
    [HttpGet("download/{extensionName}.zip")]
    public IActionResult DownloadAsZip(string extensionName)
    {
        var extensionsFolder = GetExtensionsFolder();
        var crxFilePath = GetVersionedFiles(extensionsFolder, extensionName)
            .OrderBy(x => x.Version)
            .FirstOrDefault()
            .FilePath;
        
        if (crxFilePath == null)
        {
            return NotFound($"CRX file '{extensionName}_*.crx' not found.");
        }

        var memoryStream = new MemoryStream();
        using (var archive = new System.IO.Compression.ZipArchive(memoryStream, System.IO.Compression.ZipArchiveMode.Create, true))
        {
            var zipEntry = archive.CreateEntry(Path.GetFileName(crxFilePath));
            using var entryStream = zipEntry.Open();
            using var fileStream = new FileStream(crxFilePath, FileMode.Open, FileAccess.Read);
            fileStream.CopyTo(entryStream);
        }

        memoryStream.Seek(0, SeekOrigin.Begin);
        var zipFileName = $"{extensionName}.zip";
        
        Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
        Response.Headers.Append("Pragma", "no-cache");
        Response.Headers.Append("Expires", "0");

        return File(memoryStream, "application/zip", zipFileName);
    }

    private string GetExtensionsFolder()
    {
        var extensionsFolder = Path.Combine(_env.WebRootPath, "chrome_extensions");
        if (!Directory.Exists(extensionsFolder))
        {
            throw new Exception("Extensions folder not found.");
        }
        return extensionsFolder;
    }

    private IEnumerable<(string FilePath, Version Version)> GetVersionedFiles(string folder, string extensionName)
    {
        var pattern = $"{extensionName}_*.crx";
        var crxFiles = Directory.GetFiles(folder, pattern);

        var versionPattern = new Regex($@"^{Regex.Escape(extensionName)}_(\d+\.\d+\.\d+\.\d+)\.crx$", RegexOptions.IgnoreCase);
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
