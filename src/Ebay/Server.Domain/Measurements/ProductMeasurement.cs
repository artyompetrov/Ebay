using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;
using OneOf;
using OneOf.Types;
using Server.Domain.Abstractions;
using Server.Domain.Errors;
using Server.Domain.Measurements.MeasurementTypes;

namespace Server.Domain.Measurements;

public sealed partial class ProductMeasurement : AggregateRoot<string>
{
    private const int HashMaxLength = 128;
    private const int ManufactureCodeMaxLength = 128;
    private const int LocationMaxLength = 200;
    private const int MatchIdMaxLength = 100;
    private const int LotIdMaxLength = 100;
    private const int ExpectedFileCount = 2;
    private const int MinNumberOfIntervals = 30;
    private const int MinSteppingVariableCount = 9;

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
    }

    [GeneratedRegex("^[A-Z0-9]+$")]
    private static partial Regex MeasurementIdRegex();

    public static OneOf<ProductMeasurement, DomainError> Create(
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
            return new DomainError($"Incorrect MeasurementId Format {id}");
        }

        if (manufactureCode.Length > ManufactureCodeMaxLength)
        {
            return TooLong(nameof(ManufactureCode), ManufactureCodeMaxLength);
        }

        return measurementFileParser.Parse(measurements).Match<OneOf<ProductMeasurement, DomainError>>(
            parsedMeasurements => Create(id, productId, measurements, manufactureCode, productState, parsedMeasurements),
            static error => error);
    }

    private static OneOf<ProductMeasurement, DomainError> Create(
        string id,
        Guid productId,
        byte[] measurements,
        string manufactureCode,
        ProductState productState,
        MeasurementFileParseResult parsedMeasurements)
    {
        if (parsedMeasurements.FileCount != ExpectedFileCount)
        {
            return new DomainError($"Exactly {ExpectedFileCount} files is expected but was {parsedMeasurements.FileCount}");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.NumberOfIntervals < MinNumberOfIntervals)
        {
            return new DomainError($"At least {MinNumberOfIntervals} intervals is expected");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.SteppingVariableCount < MinSteppingVariableCount)
        {
            return new DomainError($"At least {MinSteppingVariableCount} stepping variables is expected");
        }

        if (parsedMeasurements.MeasurementConfigTableParseResult.AnodeCurves is not TriodeAnodeCurves and
            not DoubleTriodeAnodeCurves and
            not PentodeAnodeCurves)
        {
            return new DomainError("AnodeCurves expected");
        }

        var hashes = new HashSet<string>
        {
            parsedMeasurements.HashAnodeCurvesConfig,
            parsedMeasurements.HashAnodeCurves
        };

        if (hashes.Count != ExpectedFileCount)
        {
            return new DomainError("File duplicates");
        }

        if (parsedMeasurements.HashAnodeCurves.Length > HashMaxLength)
        {
            return TooLong(nameof(HashAnodeCurves), HashMaxLength);
        }

        return new ProductMeasurement(
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
    }

    public void ChangeState(MeasurementState newState)
    {
        if (MeasurementState == newState)
        {
            return;
        }

        MeasurementState = newState;
        AddDomainEvent(new MeasurementStateChanged(Id));
    }

    /// <summary>
    /// Sets the matched-pair id (blank clears it).
    /// </summary>
    /// <returns><see langword="true"/> if the normalized id differs from the current one and was changed.</returns>
    public OneOf<bool, DomainError> ChangeMatchId(string? matchId)
    {
        var normalizedMatchId = Normalize(matchId);
        if (normalizedMatchId?.Length > MatchIdMaxLength)
        {
            return TooLong(nameof(MatchId), MatchIdMaxLength);
        }

        if (MatchId == normalizedMatchId)
        {
            return false;
        }

        var oldMatchId = MatchId;
        MatchId = normalizedMatchId;
        AddDomainEvent(new MeasurementMatchIdChanged(Id, oldMatchId, normalizedMatchId));
        return true;
    }

    /// <summary>
    /// Sets the storage location (blank clears it).
    /// </summary>
    public OneOf<Success, DomainError> ChangeLocation(string? location)
    {
        var normalizedLocation = Normalize(location);
        if (normalizedLocation?.Length > LocationMaxLength)
        {
            return TooLong(nameof(Location), LocationMaxLength);
        }

        Location = normalizedLocation;
        return new Success();
    }

    /// <summary>
    /// Links the measurement to a lot for sale (blank unlinks it).
    /// </summary>
    public OneOf<Success, DomainError> ChangeLotId(string? lotId)
    {
        var normalizedLotId = Normalize(lotId);
        if (normalizedLotId?.Length > LotIdMaxLength)
        {
            return TooLong(nameof(LotId), LotIdMaxLength);
        }

        LotId = normalizedLotId;
        return new Success();
    }

    public void RequestMatchedPairComparison(string otherMeasurementId) => AddDomainEvent(new MatchedPairComparisonRequested(Id, otherMeasurementId));

    public OneOf<Success, DomainError> UpdateManufactureCode(string manufactureCode)
    {
        if (string.IsNullOrWhiteSpace(manufactureCode))
        {
            return new DomainError($"{nameof(ManufactureCode)} cannot be empty string");
        }

        var trimmedManufactureCode = manufactureCode.Trim();
        if (trimmedManufactureCode.Length > ManufactureCodeMaxLength)
        {
            return TooLong(nameof(ManufactureCode), ManufactureCodeMaxLength);
        }

        ManufactureCode = trimmedManufactureCode;
        return new Success();
    }

    private static string? Normalize(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static DomainError TooLong(string propertyName, int maxLength) =>
        new($"{propertyName} must be at most {maxLength} characters long");

    public Guid ProductId { get; private set; }

    public MeasurementState MeasurementState { get; private set; }

    public byte[] Measurements { get; private set; }

    [MaxLength(HashMaxLength)]
    public string HashAnodeCurves { get; private set; }

    /// <summary>
    /// Дата производства или код
    /// </summary>
    [MaxLength(ManufactureCodeMaxLength)]
    public string ManufactureCode { get; private set; }

    public ProductState ProductState { get; private set; }

    [MaxLength(LocationMaxLength)]
    public string? Location { get; private set; }

    [MaxLength(MatchIdMaxLength)]
    public string? MatchId { get; private set; }

    [MaxLength(LotIdMaxLength)]
    public string? LotId { get; private set; }

    public DateTimeOffset? LastTimeWatchedOnEbay { get; private set; }

    public void MarkWatchedOnEbay(DateTimeOffset watchedAtUtc)
    {
        LastTimeWatchedOnEbay = watchedAtUtc.Offset == TimeSpan.Zero
            ? watchedAtUtc
            : watchedAtUtc.ToUniversalTime();
    }
}
