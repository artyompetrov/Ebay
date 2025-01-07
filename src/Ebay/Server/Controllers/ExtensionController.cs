using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Server.Controllers;


[ApiController]
[AllowAnonymous]
[Route("chrome_extensions")]
public class ExtensionController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public ExtensionController( IWebHostEnvironment env)
    {
        _env = env;
    }
    
    [HttpGet("{extensionName}.xml")]
    public IActionResult Get(string extensionName)
    {
        var extensionsFolder = Path.Combine(_env.WebRootPath, "chrome_extensions");

        if (!Directory.Exists(extensionsFolder))
        {
            return StatusCode(500, "Extensions folder not found.");
        }
        
        var pattern = $"{extensionName}_*.crx";
        var crxFiles = Directory.GetFiles(extensionsFolder, pattern);

        if (!crxFiles.Any())
        {
            return StatusCode(500, $"No CRX files found for extension '{extensionName}'.");
        }

        // Регулярное выражение для извлечения версии из имени файла
        var versionPattern = new Regex(
            $@"^{Regex.Escape(extensionName)}_(\d+\.\d+\.\d+)\.crx$",
            RegexOptions.IgnoreCase
        );
        var versionedFiles = crxFiles.Select(
                file =>
                {
                    var fileName = Path.GetFileName(file);
                    var match = versionPattern.Match(fileName);
                    if (match.Success)
                    {
                        return new
                        {
                            FilePath = file,
                            Version = match.Groups[1].Value
                        };
                    }

                    return null;
                }
            )
            .Where(x => x != null)
            .ToList();

        if (!versionedFiles.Any())
        {
            return StatusCode(500, $"No properly versioned CRX files found for extension '{extensionName}'.");
        }

        // Определяем последнюю версию (предполагаем семантическое версионирование)
        var latest = versionedFiles
            .OrderByDescending(x => Version.Parse(x!.Version))
            .First() ?? throw new NullReferenceException("latest");

        var latestVersion = latest.Version;
        var crxFileName = Path.GetFileName(latest.FilePath);
        var baseUrl = $"{Request.Scheme}://{Request.Host}{Request.PathBase}";
        
        var crxUrl = $"{baseUrl}/chrome_extensions/download/{crxFileName}";

        // Формируем XML
        var xmlContent = $@"<?xml version=""1.0"" encoding=""UTF-8""?>
<gupdate xmlns=""http://www.google.com/update2/response"" protocol=""2.0"">
  <app appid=""{extensionName}"">
    <updatecheck codebase=""{crxUrl}"" version=""{latestVersion}"" />
  </app>
</gupdate>";

        Response.Headers.Append("Cache-Control", "no-cache, no-store, must-revalidate");
        Response.Headers.Append("Pragma", "no-cache");
        Response.Headers.Append("Expires", "0");
        
        // Возвращаем XML с корректным MIME‑типом
        return Content(xmlContent, "application/xml");
    }
    
    // GET api/download/{extensionName}/{version}
    [HttpGet("download/{extensionName}_{version}.crx")]
    public IActionResult Download(string extensionName, string version)
    {
        // Путь к папке с CRX‑файлами
        var extensionsFolder = Path.Combine(_env.WebRootPath, "chrome_extensions");

        if (!Directory.Exists(extensionsFolder))
        {
            return StatusCode(500, "Extensions folder not found.");
        }

        if (extensionName.Contains('/') || extensionName.Contains('\\'))
        {
            return StatusCode(500, "Slashes in extension name");
        }
        
        var crxFileName = $"{extensionName}_{version}.crx";
        var crxFilePath = Path.Combine(extensionsFolder, crxFileName);

        if (!System.IO.File.Exists(crxFilePath))
        {
            return NotFound($"CRX file '{crxFileName}' not found.");
        }

        // Возвращаем файл с правильным MIME‑типом
        return PhysicalFile(crxFilePath, "application/x-chrome-extension", crxFileName);
    }
}
