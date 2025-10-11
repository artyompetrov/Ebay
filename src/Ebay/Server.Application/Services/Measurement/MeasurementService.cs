using Server.Application.Abstractions.Measurements;
using Server.Domain.Measurements;
using Server.Domain.Measurements.MeasurementTypes;
using Server.Domain.Measurements.MeasurementTypes.Base;

namespace Server.Application.Services.Measurement;

internal class MeasurementService
{

    private readonly IRepository<ProductMeasurement, string> _productMeasurementRepository;
    private readonly IMeasurementQueries _measurementQueries;
    private readonly IMeasurementFileParser _measurementFileParser;

    public MeasurementService(
        IRepository<ProductMeasurement, string> productMeasurementRepository,
        IMeasurementQueries measurementQueries,
        IMeasurementFileParser measurementFileParser)
    {
        _productMeasurementRepository = productMeasurementRepository;
        _measurementQueries = measurementQueries;
        _measurementFileParser = measurementFileParser;
    }

    public async Task SaveMeasurement(
        string measurementId,
        byte[] measurementsFile,
        ProductState productState,
        string manufactureCode,
        string? location,
        string? matchId,
        Guid productId,
        CancellationToken cancellationToken)
    {
        var measurement = ProductMeasurement.Create(
            id: measurementId,
            productId: productId,
            measurements: measurementsFile,
            manufactureCode: manufactureCode,
            location: location,
            matchId: matchId,
            productState: productState,
            measurementFileParser: _measurementFileParser
        );

        await _productMeasurementRepository.SaveAsync(measurement, cancellationToken);
    }

    public async Task UpdateMeasurementLocation(
        string location,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken);
        
        if (productMeasurement == null)
        {
            throw new InvalidOperationException("Measurement not found.");
        }

        productMeasurement.Location = location;
    }

    public async Task UpdateMeasurementMatchId(
        string? batchId,
        Guid productId,
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken);

        if (productMeasurement == null)
        {
            throw new InvalidOperationException("Measurement not found.");
        }

        productMeasurement.MatchId = batchId;
    }

    public async Task UpdateMeasurementState(
        MeasurementState state,
        Guid productId,//todo удалить
        string measurementId,
        CancellationToken cancellationToken)
    {
        var productMeasurement = await _productMeasurementRepository.GetByIdAsync(measurementId, cancellationToken);

        if (productMeasurement == null)
        {
            throw new InvalidOperationException("Measurement not found.");
        }

        productMeasurement.MeasurementState = state;
    }

    public async Task DeleteMeasurement(
        Guid productId, // это не надо
        string measurementId,
        CancellationToken cancellationToken)
    {
        await _productMeasurementRepository.RemoveAsync(measurementId, cancellationToken);
        
    }
    public Task<IReadOnlyCollection<MeasurementInfoWithSimilarMeasurements>> GetMeasurementInfos(
        Guid productId,
        IReadOnlyCollection<MeasurementState> measurementStates,
        CancellationToken cancellationToken) =>
        _measurementQueries.GetMeasurementInfosWithSimilarMeasurements(productId, measurementStates, cancellationToken);


    public Task<Dictionary<string, IReadOnlyCollection<SimilarMeasurementInfo>>> GetSimilarMeasurements(
        CancellationToken cancellationToken,
        string[] measurementIds) =>
        _measurementQueries.GetSimilarMeasurements(cancellationToken, measurementIds);
    

    public async Task<byte[]?> GetMeasurementFile(string measurementId, CancellationToken cancellationToken)
    {
        var zipBytes = await _measurementQueries.GetMeasurementInfoWithData(measurementId, cancellationToken);
        
        if (zipBytes == null)
            return null;

        var result = await _measurementFileParser.ToPrettifiedZip(zipBytes.Data);
        
        return result;
    }
}