using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Server.Domain.Measurements.MeasurementTypes;

namespace Server.Domain.Measurements;

public class ProductMeasurement : AggregateRoot<string>
{
    private ProductMeasurement(string id) : base(id)
    {
       
    }

    public static ProductMeasurement Create(
        string id,
        Guid productId,
        byte[] measurements,
        string manufactureCode,
        string? location,
        string? matchId,
        ProductState productState,
        IMeasurementFileParser  measurementFileParser
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
        
        if (parsedMeasurements.MeasurementConfigTableParseResult.MeasurementType is not TriodeAnodeCurves &&
            parsedMeasurements.MeasurementConfigTableParseResult.MeasurementType is not DoubleTriodeAnodeCurves &&
            parsedMeasurements.MeasurementConfigTableParseResult.MeasurementType is not PentodeAnodeCurves)
        {
            throw new MeasurementException("AnodeCurves expected");
        }
        
        var hashes = new HashSet<string> { parsedMeasurements.HashAnodeCurvesConfig, parsedMeasurements.HashAnodeCurves, parsedMeasurements.HashQuickTest };

        if (hashes.Count != 3)
        {
            throw new MeasurementException("File duplicates");
        }
        
        var product = new ProductMeasurement(id)
        {
            ProductId = productId,
            MeasurementState = MeasurementState.Created,
            Measurements = measurements,
            HashAnodeCurves = parsedMeasurements.HashAnodeCurves,
            HashQuickTest = parsedMeasurements.HashQuickTest,
            ManufactureCode = manufactureCode,
            ProductState = productState,
            Location = location,
            MatchId = matchId
        };
        
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

    public required Guid ProductId { get; init; }

    public required MeasurementState MeasurementState { get; init; }

    public required byte[] Measurements { get; init; }
    
    [MaxLength(128)]
    public  required string HashAnodeCurves { get; init; }
    
    [MaxLength(128)]
    public required string HashQuickTest { get; init; }

    public DateTime CreatedAt { get; init; }

    /// <summary>
    /// Дата производства или код
    /// </summary>
    [MaxLength(128)]
    public required string ManufactureCode { get; init; }

    public required ProductState ProductState { get; init; }
    
    /// <summary>
    /// Местонахождение
    /// </summary>
    [MaxLength(200)]
    public required string? Location { get; init; }

    /// <summary>
    /// Идентификатор подобранного набора
    /// </summary>
    [MaxLength(100)]
    public required string? MatchId { get; init; }
}