

using Server.Application.Infrastructure;

// ReSharper disable once CheckNamespace
namespace Server.Controllers.Generated;

/// <summary>
/// Расширение сгенеренного класса
/// </summary>
public partial class LotDataToExtract
{

#pragma warning disable CS8669 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context. Auto-generated code requires an explicit '#nullable' directive in source.
    private string? _descriptionText;
#pragma warning restore CS8669 // The annotation for nullable reference types should only be used in code within a '#nullable' annotations context. Auto-generated code requires an explicit '#nullable' directive in source.
    /// <summary>
    /// Описание лота без HtmlРазметки
    /// </summary>
    public string DescriptionText
    {
        get
        {
            _descriptionText ??= HtmlUtilities.ConvertToPlainText(Description);

            return _descriptionText;
        }
    }
}
