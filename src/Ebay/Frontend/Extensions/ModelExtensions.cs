using Client.Clients.Generated;
using Microsoft.AspNetCore.Components.Forms;
using Newtonsoft.Json.Linq;
using ProductWithId = Client.Clients.Generated.ProductWithId;

namespace Client.Extensions;

internal static class ModelExtensions
{
    public static ProductWithoutId ToProductWithoutId(this ProductWithId productWithId)
    {
        return new()
        {
            Name = productWithId.Name,
            SearchQueries = productWithId.SearchQueries,
            RuSearchQueries = productWithId.RuSearchQueries,
            Weight = productWithId.Weight,
            Description = productWithId.Description
        };
    }

    public static IEnumerable<ValidationProblemParsed> Parse(this ValidationProblemDetailedInfo validationProblemDetails)
    {
        foreach (var errorsAdditionalProperty in validationProblemDetails.Errors.AdditionalProperties)
        {
            var fieldName = errorsAdditionalProperty.Key;
            // The server sends an array of messages per field; anything else is shown as one message.
            List<string> errors = errorsAdditionalProperty.Value is JArray jArray
                ? [.. jArray.Select(static error => error.ToString())]
                : [errorsAdditionalProperty.Value?.ToString() ?? string.Empty];

            yield return new ValidationProblemParsed(FieldName: fieldName, Errors: errors);
        }
    }

    public static void FillValidationMessageStore(
        this ApiException<ValidationProblemDetailedInfo> errorException,
        ValidationMessageStore validationMessageStore,
        object model)
    {
        foreach (var validationProblemParsed in errorException.Result.Parse())
        {
            foreach (var error in validationProblemParsed.Errors)
            {
                validationMessageStore.Add(
                    fieldIdentifier: new FieldIdentifier(model: model, fieldName: validationProblemParsed.FieldName),
                    message: error);
            }
        }
    }

    public static string GetCondition(this LotInfoShort lotInfo) => lotInfo.Categories.Single(x => x.Type == WellKnown.Categories.Conditions.CategoryName).Value!;

    public static string GetTestState(this LotInfoShort lotInfo) => lotInfo.Categories.Single(x => x.Type == WellKnown.Categories.TestState.CategoryName).Value!;

    public record struct ValidationProblemParsed(string FieldName, IReadOnlyList<string> Errors);
}