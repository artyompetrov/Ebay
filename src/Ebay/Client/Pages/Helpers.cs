using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Components;

namespace Client.Pages;

internal static class Helpers
{
    public static string GetSearchLink(string query, Guid productId) => $"https://www.ebay.com/sch/i.html?_nkw={query}&LH_Sold=1&tool_productId={productId}";
    
    private static readonly Regex RussianLettersRegex = new(@"\p{IsCyrillic}+", RegexOptions.Compiled);
    private static readonly Regex EnglishLettersRegex = new(@"[A-Za-z]+", RegexOptions.Compiled);
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
            return new MarkupString(string.Empty);

        // 1. Подсчитываем кол-во русских и английских символов
        var totalRussian = RussianLettersRegex
            .Matches(text)
            .Sum(m => m.Length);

        var totalEnglish = EnglishLettersRegex
            .Matches(text)
            .Sum(m => m.Length);

        // 2. Если русских больше - подсвечиваем английские, иначе - русские
        var highlightEnglish = totalRussian >= totalEnglish;

        // 3. Меняем «меньшинство» через Replace
        var highlightedText = highlightEnglish
            ? EnglishLettersRegex.Replace(text, match => 
                $"<span style=\"color:{color};\">{match.Value}</span>")
            : RussianLettersRegex.Replace(text, match => 
                $"<span style=\"color:{color};\">{match.Value}</span>");

        return new MarkupString(highlightedText);
    }
}