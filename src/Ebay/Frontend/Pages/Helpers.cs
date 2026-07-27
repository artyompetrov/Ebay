using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Components;

namespace Client.Pages;

internal static partial class Helpers
{
    public static string GetSearchLink(string query, Guid productId) => $"https://www.ebay.com/sch/i.html?_nkw={query}&LH_Sold=1&tool_productId={productId}";

    /// <summary>
    /// Извлекает идентификатор измерения из отсканированного значения штрихкода:
    /// либо это сам идентификатор, либо URL, оканчивающийся идентификатором.
    /// </summary>
    /// <param name="scannedValue">Отсканированное значение штрихкода.</param>
    /// <returns>Идентификатор измерения либо пустая строка, если распознать не удалось.</returns>
    public static string ExtractMeasurementId(string scannedValue)
    {
        var value = (scannedValue ?? string.Empty).Trim();

        if (string.IsNullOrWhiteSpace(value))
        {
            return string.Empty;
        }

        if (Uri.TryCreate(value, UriKind.Absolute, out var uri))
        {
            return uri.Segments.Last().Trim('/').Trim();
        }

        if (value.Contains('/'))
        {
            return value.Split('/', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).LastOrDefault() ?? string.Empty;
        }

        return value;
    }

    /// <summary>
    /// Подсвечивает «меньшинство» (русские или английские буквы) в заданном тексте.
    /// Если русских больше, подсвечивает английские, и наоборот.
    /// </summary>
    /// <param name="text">Входная строка</param>
    /// <param name="color">Цвет подсветки (например "red")</param>
    /// <returns>Готовый HTML (MarkupString) для Blazor</returns>
    public static MarkupString HighlightMinorityLetters(string text, string color)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return new MarkupString(string.Empty);
        }

        // 1. Подсчитываем кол-во русских и английских символов
        var totalRussian = RussianLettersRegex()
            .Matches(text)
            .Sum(m => m.Length);

        var totalEnglish = EnglishLettersRegex()
            .Matches(text)
            .Sum(m => m.Length);

        // 2. Если русских больше - подсвечиваем английские, иначе - русские
        var highlightEnglish = totalRussian >= totalEnglish;

        // 3. Меняем «меньшинство» через Replace
        var highlightedText = highlightEnglish
            ? EnglishLettersRegex().Replace(text, match =>
                $"<span style=\"color:{color};\">{match.Value}</span>")
            : RussianLettersRegex().Replace(text, match =>
                $"<span style=\"color:{color};\">{match.Value}</span>");

        return new MarkupString(highlightedText);
    }

    [GeneratedRegex(@"\p{IsCyrillic}+", RegexOptions.Compiled)]
    private static partial Regex RussianLettersRegex();
    [GeneratedRegex(@"[A-Za-z]+", RegexOptions.Compiled)]
    private static partial Regex EnglishLettersRegex();
}