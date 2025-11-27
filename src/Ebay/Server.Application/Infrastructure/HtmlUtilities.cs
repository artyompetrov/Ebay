using HtmlAgilityPack;

namespace Server.Application.Infrastructure;

internal class HtmlUtilities
{
    /// <summary>
    /// Converts HTML to plain text / strips tags.
    /// </summary>
    /// <param name="html">The HTML.</param>
    /// <returns></returns>
    public static string ConvertToPlainText(string html)
    {
        var doc = new HtmlDocument();
        doc.LoadHtml(html);

        var sw = new StringWriter();
        ConvertTo(node: doc.DocumentNode, outText: sw);
        sw.Flush();
        return sw.ToString();
    }


    /// <summary>
    /// Count the words.
    /// The content has to be converted to plain text before (using ConvertToPlainText).
    /// </summary>
    /// <param name="plainText">The plain text.</param>
    /// <returns></returns>
    public static int CountWords(string plainText) => !string.IsNullOrEmpty(plainText) ? plainText.Split(' ', '\n').Length : 0;


    public static string Cut(string text, int length)
    {
        if (!string.IsNullOrEmpty(text) && text.Length > length)
        {
            text = string.Concat(text.AsSpan(start: 0, length: length - 4), " ...");
        }

        return text;
    }


    private static void ConvertContentTo(HtmlNode node, TextWriter outText)
    {
        foreach (var subnode in node.ChildNodes)
        {
            ConvertTo(node: subnode, outText: outText);
        }
    }


    private static void ConvertTo(HtmlNode node, TextWriter outText)
    {
        string html;
        switch (node.NodeType)
        {
            case HtmlNodeType.Comment:
                // don't output comments
                break;

            case HtmlNodeType.Document:
                ConvertContentTo(node: node, outText: outText);
                break;

            case HtmlNodeType.Text:
                // script and style must not be output
                var parentName = node.ParentNode.Name;
                if (parentName is "script" or "style" or "title")
                {
                    break;
                }

                // get text
                html = ((HtmlTextNode)node).Text;

                // is it in fact a special closing node output as text?
                if (HtmlNode.IsOverlappedClosingElement(html))
                {
                    break;
                }

                // check the text is meaningful and not a bunch of whitespaces
                if (html.Trim().Length > 0)
                {
                    outText.Write(HtmlEntity.DeEntitize(html));
                }

                break;

            case HtmlNodeType.Element:

                if (node.Name is "p" or "br" or "div")
                {
                    outText.Write("\r\n");
                }

                if (node.HasChildNodes)
                {
                    ConvertContentTo(node: node, outText: outText);
                }

                break;
            default:
                break;
        }
    }
}
