using System.IO.Compression;
using Microsoft.EntityFrameworkCore;
using Server.Data;
using Server.Data.Models;

namespace Server.Services;

internal class MeasurementsService
{
    private readonly ApplicationDbContext _applicationContext;

    public MeasurementsService(ApplicationDbContext applicationContext)
    {
        _applicationContext = applicationContext;
    }

    public async Task SaveMeasurement(
        Guid productId,
        Guid measurementId,
        Stream file,
        CancellationToken cancellationToken)
    {
        using var inputMemoryStream = new MemoryStream();
        await file.CopyToAsync(inputMemoryStream, cancellationToken);
        inputMemoryStream.Position = 0;

        using var archive = new ZipArchive(inputMemoryStream, ZipArchiveMode.Read, leaveOpen: true);

        await _applicationContext.ProductMeasurements.Upsert(
                new ProductMeasurement
                {
                    Id = measurementId, ProductId = productId, Measurements = inputMemoryStream.ToArray()
                })
            .RunAsync(cancellationToken);
        
        await _applicationContext.SaveChangesAsync(cancellationToken);
    }
}