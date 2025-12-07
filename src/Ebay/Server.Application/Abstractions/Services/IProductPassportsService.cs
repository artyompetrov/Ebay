namespace Server.Application.Abstractions.Services;

public interface IProductPassportsService
{
    Task DeleteProductPassport(Guid productId, Guid passportId, CancellationToken cancellationToken);
    Task<ICollection<ProductPassportInfo>> GetProductPassportsAsync(Guid productId, CancellationToken cancellationToken);
    Task UploadProductPassportAsync(ProductPassportUpload passport, Guid productId, CancellationToken cancellationToken);

    Task UpdateProductPassportAsync(
        ProductPassportUpdate passport,
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken);
}