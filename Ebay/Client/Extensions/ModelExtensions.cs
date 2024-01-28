using Ebay.Client.Clients.Generated;
using Microsoft.AspNetCore.Components.Forms;
using Newtonsoft.Json.Linq;

namespace Ebay.Client.Extensions;

public static class ModelExtensions
{
    public static ProductWithoutId Copy(this ProductWithoutId product) => new()
        { Name = product.Name, SearchQueries = product.SearchQueries };

    public static ProductWithId Copy(this ProductWithId product) => new()
        { Id = product.Id, Name = product.Name, SearchQueries = product.SearchQueries };

    public static ProductWithoutId ToProductWithoutId(this ProductWithId productWithId) => new()
    {
        Name = productWithId.Name,
        SearchQueries = productWithId.SearchQueries
    };

    public static IEnumerable<ValidationProblemParsed> Parse(this ValidationProblemDetailedInfo validationProblemDetails)
    {
        foreach (var errorsAdditionalProperty in validationProblemDetails.Errors.AdditionalProperties)
        {
            var fieldName = errorsAdditionalProperty.Key;
            var errors = new List<string>();
            if (errorsAdditionalProperty.Value is JArray jArray)
            {
                foreach (var error in jArray)
                {
                    errors.Add(error.ToString());
                }
            }
            else
                throw new InvalidOperationException(
                    $"{nameof(errorsAdditionalProperty)}.{nameof(errorsAdditionalProperty.Value)} expected to be jArray");

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

    public record struct ValidationProblemParsed(string FieldName, IReadOnlyList<string> Errors);
}