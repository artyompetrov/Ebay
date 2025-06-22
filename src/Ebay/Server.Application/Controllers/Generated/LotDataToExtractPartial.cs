

using Server.Application.Infrastructure;

namespace Server.Controllers.Generated;

/// <summary>
/// Расширение сгенеренного класса
/// </summary>
public partial class LotDataToExtract
{

    private string _descriptionText = null;
    /// <summary>
    /// Описание лота без HtmlРазметки
    /// </summary>
    public string DescriptionText
    {
        get
        {
            if (_descriptionText == null)
            {
                _descriptionText = HtmlUtilities.ConvertToPlainText(Description);
            }

            return _descriptionText;
        }
    }
}