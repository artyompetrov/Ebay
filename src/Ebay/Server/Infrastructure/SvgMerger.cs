using System.Xml.Linq;

namespace Server.Infrastructure;

public static class SvgMerger
{
    public static string MergeSvgsHorizontally(params string[] svgXmlList)
    {
        if (svgXmlList == null || svgXmlList.Length == 0)
            throw new ArgumentException("List must not be empty");

        var svgs = new List<XElement>();
        var widths = new List<double>();
        var heights = new List<double>();

        // Читаем каждое svg, парсим размеры и саму картинку
        foreach (var svgXml in svgXmlList)
        {
            var svgElem = XElement.Parse(svgXml);
            var width = double.Parse(svgElem.Attribute("width")?.Value.Replace("px", "") ?? "0");
            var height = double.Parse(svgElem.Attribute("height")?.Value.Replace("px", "") ?? "0");
            svgs.Add(svgElem);
            widths.Add(width);
            heights.Add(height);
        }

        // Общая ширина — сумма ширин, высота — максимум
        var totalWidth = widths.Sum();

        var maxHeight = heights.Prepend(0).Max();

        XNamespace ns = "http://www.w3.org/2000/svg";
        var outSvg = new XElement(ns + "svg",
            new XAttribute("width", totalWidth),
            new XAttribute("height", maxHeight),
            new XAttribute("xmlns", ns)
        );

        double offsetX = 0;
        for (var i = 0; i < svgs.Count; i++)
        {
            // Вырезаем содержимое исходного SVG
            foreach (var node in svgs[i].Elements())
            {
                var g = new XElement(ns + "g",
                    new XAttribute("transform", $"translate({offsetX}, 0)"),
                    node
                );
                outSvg.Add(g);
            }
            offsetX += widths[i];
        }

        var doc = new XDocument(new XDeclaration("1.0", "utf-8", "yes"), outSvg);
        return doc.ToString();
    }
}