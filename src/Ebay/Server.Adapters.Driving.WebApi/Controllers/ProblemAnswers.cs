using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Server.Adapters.Driving.WebApi.Generated;
using Server.Domain.Errors;

namespace Server.Adapters.Driving.WebApi.Controllers;

/// <summary>
/// Error answers of the Web API contract. Controllers return them for the failure cases of application results
/// (<c>OneOf.Types.NotFound</c>, <see cref="Server.Domain.Errors.DomainError" />) and for their own input checks.
/// </summary>
internal static class ProblemAnswers
{
    // The legacy contract answers "not found" with 400, not 404.
    private const int NotFoundStatusCode = StatusCodes.Status400BadRequest;

    public static ObjectResult NotFound() =>
        ToResult(new NotFoundProblemDetailedInfo(
            detail: null,
            instance: null,
            status: NotFoundStatusCode,
            title: null,
            type: nameof(NotFoundProblemDetailedInfo),
            errors: null));

    /// <summary>
    /// A business rule rejected the request: answered as a validation problem of <paramref name="field" />.
    /// </summary>
    public static ObjectResult DomainError(string field, DomainError error) => ValidationError(field, error.Message);

    public static ObjectResult ValidationError(string field, params string[] errors) =>
        ValidationError([(field, errors)]);

    public static ObjectResult ValidationError(IEnumerable<(string Field, string[] Errors)> errors) =>
        ToResult(new ValidationProblemDetailedInfo(
            detail: null,
            instance: null,
            status: StatusCodes.Status400BadRequest,
            title: null,
            type: nameof(ValidationProblemDetailedInfo),
            errors: new Errors2
            {
                AdditionalProperties = errors
                    .SelectMany(static pair => pair.Errors.Select(message => (pair.Field, Message: message)))
                    .GroupBy(static x => x.Field)
                    .ToDictionary(
                        static g => g.Key,
                        static g => (object)g.Select(static x => x.Message).ToArray())
            }));

    private static ObjectResult ToResult(ProblemDetailedInfo problemDetails) =>
        new(problemDetails) { StatusCode = problemDetails.Status };
}
