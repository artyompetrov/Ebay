using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using Server.Domain.Abstractions;
using Server.Domain.Measurements.MeasurementTypes;

namespace Server.Domain.Measurements;

public sealed partial class ProductMeasurement : AggregateRoot<string>
{
    private ProductMeasurement(
        string id,
        Guid productId,
        byte[] measurements,
        string hashAnodeCurves,
        string manufactureCode,
        ProductState productState,
        string? location,
        string? matchId,
        string? lotId
        ) : base(id)
    {
        ProductId = productId;
        MeasurementState = MeasurementState.Created;
        Measurements = measurements;
        HashAnodeCurves = hashAnodeCurves;

        ManufactureCode = manufactureCode;
        ProductState = productState;
        Location = location;
        MatchId = matchId;
        LotId = lotId;

        Validate();
    }

    [GeneratedRegex("^[A-Z0-9]+$")]
    private static partial Regex MeasurementIdRegex();

    public static ProductMeasurement Create(
        string id,
        Guid productId,
        byte[] measurements,
        string manufactureCode,
        ProductState productState,
        IMeasurementFileParser measurementFileParser
    )
    {
        if (!MeasurementIdRegex().IsMatch(input: id))
        {
            throw new MeasurementException($"Incorrect MeasurementId Format {id}");
        }

        var parsedMeasurements = measurementFileParser.Parse(measurements);

        if (parsedMeasurements.FileCount != 2)
        {
            throw new MeasurementException($"Exactly 2 files is expected but was {parsedMeasurements.FileCount}");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.NumberOfIntervals < 30)
        {
            throw new MeasurementException("At least 30 intervals is expected");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.SteppingVariableCount < 9)
        {
            throw new MeasurementException("At least 9 stepping variables is expected");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.AnodeCurves is not TriodeAnodeCurves and
            not DoubleTriodeAnodeCurves and
            not PentodeAnodeCurves)
        {
            throw new MeasurementException("AnodeCurves expected");
        }

        var hashes = new HashSet<string>
        {
            parsedMeasurements.HashAnodeCurvesConfig,
            parsedMeasurements.HashAnodeCurves
        };

        if (hashes.Count != 2)
        {
            throw new MeasurementException("File duplicates");
        }

        var product = new ProductMeasurement(
            id: id,
            productId: productId,
            measurements: measurements,
            hashAnodeCurves: parsedMeasurements.HashAnodeCurves,
            manufactureCode: manufactureCode,
            productState: productState,
            location: null,
            matchId: null,
            lotId: null
        );

        return product;
    }


    public void UpdateManufactureCode(string manufactureCode)
    {
        if (string.IsNullOrWhiteSpace(manufactureCode))
        {
            throw new ValidationException($"{nameof(ManufactureCode)} cannot be empty string");
        }

        ManufactureCode = manufactureCode.Trim();

        Validate();
    }


    private void Validate()
    {
        Validator.ValidateObject(
            instance: this,
            validationContext: new ValidationContext(this),
            validateAllProperties: true
        );

        if (MatchId is not null && string.IsNullOrWhiteSpace(MatchId))
        {
            throw new ValidationException($"{nameof(MatchId)} cannot be empty string");
        }

        if (Location is not null && string.IsNullOrWhiteSpace(Location))
        {
            throw new ValidationException($"{nameof(Location)} cannot be empty string");
        }

        if (LotId is not null && string.IsNullOrWhiteSpace(LotId))
        {
            throw new ValidationException($"{nameof(LotId)} cannot be empty string");
        }
    }

    public Guid ProductId { get; private set; }

    public MeasurementState MeasurementState { get; set; }

    public byte[] Measurements { get; private set; }

    [MaxLength(128)]
    public string HashAnodeCurves { get; private set; }


    /// <summary>
    /// Дата производства или код
    /// </summary>
    [MaxLength(128)]
    public string ManufactureCode { get; private set; }

    public ProductState ProductState { get; private set; }

    [MaxLength(200)]
    public string? Location
    {
        get;
        set
        {
            field = value;
            Validate();
        }
    }

    [MaxLength(100)]
    public string? MatchId
    {
        get;
        set
        {
            field = value;
            Validate();
        }
    }

    [MaxLength(100)]
    public string? LotId
    {
        get;
        set
        {
            field = value?.Trim();
            Validate();
        }
    }

    public DateTime? LastTimeWatchedOnEbay { get; private set; }

    public void MarkWatchedOnEbay(DateTime watchedAtUtc)
    {
        LastTimeWatchedOnEbay = watchedAtUtc.Kind == DateTimeKind.Utc
            ? watchedAtUtc
            : watchedAtUtc.ToUniversalTime();
    }
}