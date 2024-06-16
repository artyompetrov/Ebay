
using Ebay.Server.Controllers.Generated;

namespace Ebay.Server.Controllers;

internal class NonOkHttpAnswerException : Exception
{
    public ProblemDetailedInfo ProblemDetails { get; }

    private NonOkHttpAnswerException(ProblemDetailedInfo problemDetails)
    {
        ProblemDetails = problemDetails;
    }

    public static NonOkHttpAnswerException ValidationError400(IDictionary<string, string[]> errors) => new(
        new ValidationProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 400,
            title: null,
            type: nameof(ValidationProblemDetailedInfo),
            errors: new Errors2 { AdditionalProperties = errors.ToDictionary(x => x.Key, x => (object)x.Value) }));


    public static NonOkHttpAnswerException NotFound400() => new(
        new NotFoundProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 400,
            title: null,
            type: nameof(NotFoundProblemDetailedInfo),
            errors: null));

    public static NonOkHttpAnswerException NotAvailable503() => new(
        new NotFoundProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 503,
            title: null,
            type: "ServiceNotAvailable",
            errors: null));
}