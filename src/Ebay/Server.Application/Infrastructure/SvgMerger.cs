using System.Globalization;
using System.Xml.Linq;

namespace Server.Application.Infrastructure;

public static class SvgMerger
{
    public record Svg(string? SvgXml, bool ReplaceFont);

    public static string MergeSvgs(bool mergeVertical, params Svg[] svg)
    {
        const string defaultFontFamily = "Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif";

        var svgList = svg.Where(x => x != null).Select(x => x!).ToArray() ?? throw new ArgumentException("List must not be empty");
        if (svgList.Length == 0)
        {
            throw new ArgumentException("List must not be empty");
        }

        var svgs = new List<XElement>();
        var widths = new List<double>();
        var heights = new List<double>();

        foreach (var svgXml in svgList)
        {
            if (svgXml.SvgXml == null)
            {
                continue;
            }

            var svgElem = XElement.Parse(svgXml.SvgXml);


            // Удаляем все font-family у <text>
            if (svgXml.ReplaceFont)
            {
                foreach (var textElem in svgElem.Descendants().Where(e => e.Name.LocalName == "text"))
                {
                    textElem.Attribute("font-family")?.Remove();
                    textElem.SetAttributeValue("font-family", defaultFontFamily);
                }
            }

            var width = double.Parse(svgElem.Attribute("width")?.Value.Replace("px", "") ?? "0", CultureInfo.InvariantCulture);
            var height = double.Parse(svgElem.Attribute("height")?.Value.Replace("px", "") ?? "0", CultureInfo.InvariantCulture);
            svgs.Add(svgElem);
            widths.Add(width);
            heights.Add(height);
        }

        double totalWidth, totalHeight;
        if (!mergeVertical)
        {
            totalWidth = widths.Sum();
            totalHeight = heights.Max();
        }
        else
        {
            totalWidth = widths.Max();
            totalHeight = heights.Sum();
        }

        XNamespace ns = "http://www.w3.org/2000/svg";
        var outSvg = new XElement(ns + "svg",
            new XAttribute("width", totalWidth),
            new XAttribute("height", totalHeight),
            new XAttribute("xmlns", ns)
        );

        double offsetX = 0, offsetY = 0;
        for (var i = 0; i < svgs.Count; i++)
        {
            foreach (var node in svgs[i].Elements())
            {
                var g = new XElement(ns + "g",
                    new XAttribute("transform", value: mergeVertical
                        ? $"translate(0, {offsetY})"
                        : $"translate({offsetX}, 0)"),
                    node
                );
                outSvg.Add(g);
            }
            if (!mergeVertical)
            {
                offsetX += widths[i];
            }
            else
            {
                offsetY += heights[i];
            }
        }

        var doc = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), outSvg);
        return doc.ToString();
    }
}
