
using Ebay.Server.Controllers.Generated;

namespace Ebay.Server.Controllers;

public class NonOkHttpAnswerException : Exception
{
    public ProblemDetailedInfo ProblemDetails { get; }

    private NonOkHttpAnswerException(ProblemDetailedInfo problemDetails)
    {
        ProblemDetails = problemDetails;
    }


    public static NonOkHttpAnswerException NotFound400() => new(
        new NotFoundProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 400,
            title: null,
            type: nameof(NotFoundProblemDetailedInfo),
            errors: null));
}