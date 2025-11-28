

using System.Diagnostics.CodeAnalysis;
using Server.Application.Infrastructure;

// ReSharper disable once CheckNamespace
namespace Server.Controllers.Generated;

/// <summary>
/// Расширение сгенеренного класса
/// </summary>
public partial class LotDataToExtract
{
    /// <summary>
    /// Описание лота без HtmlРазметки
    /// </summary>
    [field: AllowNull, MaybeNull]
    public string DescriptionText
    {
        get
        {
            field ??= HtmlUtilities.ConvertToPlainText(Description);

            return field;
        }
    }
}