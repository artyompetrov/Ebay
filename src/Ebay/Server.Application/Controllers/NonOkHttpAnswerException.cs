
using Server.Controllers.Generated;

namespace Server.Application.Controllers;

[Obsolete("Нужно сделать приватным исключением адаптера")]
internal sealed class NonOkHttpAnswerException : Exception
{
    public ProblemDetailedInfo ProblemDetails { get; }

    private NonOkHttpAnswerException(ProblemDetailedInfo problemDetails)
    {
        ProblemDetails = problemDetails;
    }

    public static NonOkHttpAnswerException ValidationError400(List<(string, string[])> errors)
    {
        return new(
        new ValidationProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 400,
            title: null,
            type: nameof(ValidationProblemDetailedInfo),
            errors: new Errors2
            {
                AdditionalProperties = errors
                    .SelectMany(pair => pair.Item2.Select(msg => (pair.Item1, msg)))
                    .GroupBy(x => x.Item1)
                    .ToDictionary(
                        g => g.Key,
                        g => (object)g.Select(x => x.msg).ToArray()
                    )
            }));
    }

    public static NonOkHttpAnswerException ValidationError400(string field, params string[] errors)
    {
        return new(
        new ValidationProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 400,
            title: null,
            type: nameof(ValidationProblemDetailedInfo),
            errors: new Errors2
            {
                AdditionalProperties = new Dictionary<string, object>
                {
                    { field, errors }
                }
            }));
    }

    public static NonOkHttpAnswerException NotFound400()
    {
        return new(
        new NotFoundProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 400,
            title: null,
            type: nameof(NotFoundProblemDetailedInfo),
            errors: null));
    }

    public static NonOkHttpAnswerException NotAvailable503()
    {
        return new(
        new NotFoundProblemDetailedInfo(
            detail: null,
            instance: null,
            status: 503,
            title: null,
            type: "ServiceNotAvailable",
            errors: null));
    }
}