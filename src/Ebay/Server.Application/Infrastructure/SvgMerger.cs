using System.Xml.Linq;

namespace Server.Application.Infrastructure;

public static class SvgMerger
{
    public static string MergeSvgsHorizontally(bool vertical, string? defaultFontFamily, params string[] svgXmlList)
    {
        var svgList = svgXmlList?.ToArray() ?? throw new ArgumentException("List must not be empty");
        if (svgList.Length == 0)
            throw new ArgumentException("List must not be empty");

        var svgs = new List<XElement>();
        var widths = new List<double>();
        var heights = new List<double>();

        foreach (var svgXml in svgList)
        {
            var svgElem = XElement.Parse(svgXml);

            // Удаляем все font-family у <text>
            if (!string.IsNullOrWhiteSpace(defaultFontFamily))
            {
                foreach (var textElem in svgElem.Descendants().Where(e => e.Name.LocalName == "text"))
                {
                    textElem.Attribute("font-family")?.Remove();
                }
            }

            var width = double.Parse(svgElem.Attribute("width")?.Value.Replace("px", "") ?? "0");
            var height = double.Parse(svgElem.Attribute("height")?.Value.Replace("px", "") ?? "0");
            svgs.Add(svgElem);
            widths.Add(width);
            heights.Add(height);
        }

        double totalWidth, totalHeight;
        if (!vertical)
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

        // Добавляем CSS для font-family, если задано
        if (!string.IsNullOrWhiteSpace(defaultFontFamily))
        {
            var style = new XElement(ns + "style",
                new XAttribute("type", "text/css"),
                $"text {{ font-family: {defaultFontFamily}; }}"
            );
            outSvg.AddFirst(style);
        }

        double offsetX = 0, offsetY = 0;
        for (var i = 0; i < svgs.Count; i++)
        {
            foreach (var node in svgs[i].Elements())
            {
                var g = new XElement(ns + "g",
                    new XAttribute("transform", value: vertical
                        ? $"translate(0, {offsetY})"
                        : $"translate({offsetX}, 0)"),
                    node
                );
                outSvg.Add(g);
            }
            if (!vertical)
                offsetX += widths[i];
            else
                offsetY += heights[i];
        }

        var doc = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), outSvg);
        return doc.ToString();
    }
}