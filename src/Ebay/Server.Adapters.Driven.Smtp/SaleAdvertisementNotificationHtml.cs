using System.Globalization;
using System.Net;
using System.Text;
using Server.Domain.SaleAdvertisements;

namespace Server.Adapters.Driven.Smtp;

/// <summary>
/// Представление уведомления об объявлении в виде письма: тема и HTML-тело с одной таблицей,
/// где каждая строка объявления объединена со всеми совпавшими с ней товарами.
/// </summary>
internal static class SaleAdvertisementNotificationHtml
{
    // Внешние ширины колонок фиксированы, чтобы длинный текст переносился, а не расширял таблицу: на компьютере она
    // целиком помещается в окно письма, на телефоне требует лишь небольшой горизонтальной прокрутки.
    private const int LineColumnWidthPx = 250;
    private const int ProductColumnWidthPx = 150;
    private const int PriceColumnWidthPx = 90;
    private const int QuantityColumnWidthPx = 70;
    private const int TableWidthPx = LineColumnWidthPx + ProductColumnWidthPx + PriceColumnWidthPx + QuantityColumnWidthPx;

    private const int BorderWidthPx = 1;
    private const int CellPaddingPx = 4;
    private const int FontSizePx = 14;

    private const string WrappingCellStyle = "vertical-align:top;overflow-wrap:anywhere;word-break:break-word;word-wrap:break-word";
    private const string NoWrapCellStyle = "vertical-align:top;white-space:nowrap";

    public static string Subject(SaleAdvertisementNotification notification) =>
        $"{notification.Title} [{notification.SellerName}]";

    public static string Body(SaleAdvertisementNotification notification)
    {
        var body = new StringBuilder();
        body.Append($"<a href=\"{Encode(notification.Link.AbsoluteUri)}\">ссылка</a><br><br>");
        AppendTable(body, notification.Lines);

        if (notification.Contact is { } contact)
        {
            body.Append($"<br><div>{Encode(contact)}</div>");
        }

        return body.ToString();
    }

    private static void AppendTable(StringBuilder body, IEnumerable<SaleAdvertisementNotificationLine> lines)
    {
        body.Append(Invariant(
            $"""<table width="{TableWidthPx}" border="{BorderWidthPx}" cellpadding="{CellPaddingPx}" style="border-collapse:collapse;table-layout:fixed;width:{TableWidthPx}px;font-size:{FontSizePx}px">"""));
        body.Append("<tr>");
        body.Append(HeaderCell("Строка объявления", LineColumnWidthPx));
        body.Append(HeaderCell("Товар", ProductColumnWidthPx));
        body.Append(HeaderCell("Оценка", PriceColumnWidthPx));
        body.Append(HeaderCell("Продано шт.", QuantityColumnWidthPx));
        body.Append("</tr>");

        foreach (var line in lines)
        {
            for (var i = 0; i < line.Products.Count; i++)
            {
                body.Append("<tr>");

                if (i == 0)
                {
                    body.Append(Invariant(
                        $"<td rowspan=\"{line.Products.Count}\" style=\"{WrappingCellStyle}\">{Encode(line.Text)}</td>"));
                }

                AppendProductCells(body, line.Products[i]);
                body.Append("</tr>");
            }
        }

        body.Append("</table>");
    }

    private static void AppendProductCells(StringBuilder body, SaleAdvertisementNotificationProduct product)
    {
        var name = Encode(product.Name);
        var price = product.EstimatedPrice;

        body.Append($"<td style=\"{WrappingCellStyle}\">{(product.IsTriggering ? $"<b>{name}</b>" : name)}</td>");
        body.Append($"<td style=\"{NoWrapCellStyle}\">{price.Amount.ToString("0", CultureInfo.InvariantCulture)} {Encode(price.CurrencyId)}</td>");
        body.Append($"<td style=\"{NoWrapCellStyle}\">{product.QuantityTotal.ToString(CultureInfo.InvariantCulture)}</td>");
    }

    // Ширина ячейки задаёт ширину содержимого: вычитаем поля и рамку, чтобы итоговая колонка заняла внешнюю ширину.
    private static string HeaderCell(string title, int columnWidthPx)
    {
        var contentWidthPx = columnWidthPx - 2 * CellPaddingPx - BorderWidthPx;

        return Invariant($"<th width=\"{contentWidthPx}\" style=\"width:{contentWidthPx}px\">{title}</th>");
    }

    private static string Encode(string text) => WebUtility.HtmlEncode(text);

    private static string Invariant(FormattableString text) => text.ToString(CultureInfo.InvariantCulture);
}
