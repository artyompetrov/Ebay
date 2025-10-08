using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Server.Domain.Measurements.MeasurementTypes;

namespace Server.Domain.Measurements;

public class ProductMeasurement : AggregateRoot<string>
{
    private ProductMeasurement(
        string id,
        Guid productId,
        byte[] measurements,
        string hashAnodeCurves,
        string hashQuickTest,
        string manufactureCode,
        ProductState productState,
        string? location,
        string? matchId
        ) : base(id)
    {
        ProductId = productId;
        MeasurementState = MeasurementState.Created;
        Measurements = measurements;
        HashAnodeCurves = hashAnodeCurves;
        HashQuickTest = hashQuickTest;
        ManufactureCode = manufactureCode;
        ProductState = productState;
        Location = location;
        MatchId = matchId;
    }

    internal static ProductMeasurement Create(
        string id,
        Guid productId,
        byte[] measurements,
        string manufactureCode,
        string? location,
        string? matchId,
        ProductState productState,
        IMeasurementFileParser measurementFileParser
    )
    {
        if (!Regex.IsMatch(input: id, pattern: "^[A-Z0-9]+$"))
        {
            throw new MeasurementException($"Incorrect MeasurementId Format {id}");
        }

        var parsedMeasurements = measurementFileParser.Parse(measurements);

        if (parsedMeasurements.FileCount != 3)
        {
            throw new MeasurementException($"Exactly 3 files is expected but was {parsedMeasurements.FileCount}");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.NumberOfIntervals < 30)
        {
            throw new MeasurementException("At least 30 intervals is expected");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.SteppingVariableCount < 9)
        {
            throw new MeasurementException("At least 9 stepping variables is expected");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.AnodeCurves is not TriodeAnodeCurves &&
            parsedMeasurements.MeasurementConfigTableParseResult.AnodeCurves is not DoubleTriodeAnodeCurves &&
            parsedMeasurements.MeasurementConfigTableParseResult.AnodeCurves is not PentodeAnodeCurves)
        {
            throw new MeasurementException("AnodeCurves expected");
        }

        var hashes = new HashSet<string>
        {
            parsedMeasurements.HashAnodeCurvesConfig,
            parsedMeasurements.HashAnodeCurves,
            parsedMeasurements.HashQuickTest
        };

        if (hashes.Count != 3)
        {
            throw new MeasurementException("File duplicates");
        }

        var product = new ProductMeasurement(
            id: id,
            productId: productId,
            measurements: measurements,
            hashAnodeCurves: parsedMeasurements.HashAnodeCurves,
            hashQuickTest: parsedMeasurements.HashQuickTest,
            manufactureCode: manufactureCode,
            productState:  productState,
            location:  location,
            matchId:  matchId
        );

        product.Validate();

        return product;
    }
    

    private void Validate()
    {
        Validator.ValidateObject(
            instance: this,
            validationContext: new ValidationContext(this),
            validateAllProperties: true
        );
    }

    internal Guid ProductId { get; private set; }

    internal MeasurementState MeasurementState { get; set; }

    internal byte[] Measurements { get; private set; }
    
    [MaxLength(128)]
    internal  string HashAnodeCurves { get; private set; }
    
    [MaxLength(128)]
    internal string HashQuickTest { get; private set; }

    internal DateTime CreatedAt { get; private set; }

    /// <summary>
    /// Дата производства или код
    /// </summary>
    [MaxLength(128)]
    internal string ManufactureCode { get; private set; }

    internal ProductState ProductState { get; private set; }
    
    /// <summary>
    /// Местонахождение
    /// </summary>
    [MaxLength(200)]
    internal string? Location { get; set; }

    /// <summary>
    /// Идентификатор подобранного набора
    /// </summary>
    [MaxLength(100)]
    internal string? MatchId { get; set; }
}