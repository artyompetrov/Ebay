using System.Globalization;
using System.Text.RegularExpressions;
using AwesomeAssertions;

namespace Tests.Unit.Fakes;

/// <summary>
/// Разбирает таблицу письма-уведомления об объявлении на группы «строка объявления — товары».
/// Ячейки возвращаются как есть (HTML), чтобы тесты могли проверить выделение и экранирование.
/// </summary>
internal static class NotificationTable
{
    private const int LineGroupCellCount = 4;

    public sealed record Product(string NameHtml, string Price, string Quantity);

    public sealed record Group(string LineHtml, int RowSpan, List<Product> Products);

    public static IReadOnlyList<Group> Groups(string body)
    {
        var groups = new List<Group>();

        foreach (Match row in Regex.Matches(body, "<tr>(.*?)</tr>"))
        {
            var cells = Regex.Matches(row.Groups[1].Value, "<td(?<attrs>[^>]*)>(?<html>.*?)</td>");

            if (cells.Count == 0)
            {
                continue;
            }

            var productOffset = 0;

            if (cells.Count == LineGroupCellCount)
            {
                var rowSpan = Regex.Match(cells[0].Groups["attrs"].Value, "rowspan=\"(\\d+)\"").Groups[1].Value;
                groups.Add(new Group(cells[0].Groups["html"].Value, int.Parse(rowSpan, CultureInfo.InvariantCulture), []));
                productOffset = 1;
            }

            groups[^1].Products.Add(new Product(
                NameHtml: cells[productOffset].Groups["html"].Value,
                Price: cells[productOffset + 1].Groups["html"].Value,
                Quantity: cells[productOffset + 2].Groups["html"].Value));
        }

        foreach (var group in groups)
        {
            group.Products.Should().HaveCount(group.RowSpan, "the line cell of \"{0}\" must span exactly its product rows", group.LineHtml);
        }

        return groups;
    }
}
