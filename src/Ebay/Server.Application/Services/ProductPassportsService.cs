using Server.Application.Abstractions;
using Server.Application.Abstractions.Services;
using Server.Domain;

namespace Server.Application.Services;

public class ProductPassportsService : IProductPassportsService
{
    private readonly IUnitOfWork _unitOfWork;

    public ProductPassportsService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task DeleteProductPassport(Guid productId, Guid passportId, CancellationToken cancellationToken)
    {
        
        
        var passport = await _applicationContext.ProductPassports
            .SingleOrDefaultAsync(x => x.ProductId == productId && x.Id == passportId, cancellationToken) ?? throw NonOkHttpAnswerException.NotFound400();
        var order = passport.Order;

        _ = _applicationContext.ProductPassports.Remove(passport);

        var passportsToUpdate = await _applicationContext.ProductPassports
            .Where(x => x.ProductId == productId && x.Order > order)
            .ToListAsync(cancellationToken);

        foreach (var p in passportsToUpdate)
        {
            p.Order--;
        }

        _ = await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    public async Task<ICollection<ProductPassportInfo>> GetProductPassportsAsync(Guid productId, CancellationToken cancellationToken)
    {
        
        return await _applicationContext.ProductPassports
            .AsNoTracking()
            .Where(x => x.ProductId == productId)
            .OrderBy(x => x.Order)
            .Select(x => new ProductPassportInfo(x.FileName, x.Id, x.Order))
            .ToListAsync(cancellationToken);
    }

    public async Task UploadProductPassportAsync(ProductPassportUpload passport, Guid productId, CancellationToken cancellationToken)
    {
        
        
        var order = passport.Order ??
                    ((await _applicationContext.ProductPassports
                        .Where(x => x.ProductId == productId)
                        .Select(x => (int?)x.Order)
                        .MaxAsync(cancellationToken)) ?? -1) + 1;

        var entity = new ProductPassport
        {
            Id = Guid.NewGuid(),
            ProductId = productId,
            FileName = passport.FileName,
            ContentType = passport.ContentType,
            Order = order,
            Content = passport.File
        };

        _ = await _applicationContext.ProductPassports.AddAsync(entity, cancellationToken);
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
        
    }

    public async Task UpdateProductPassportAsync(
        ProductPassportUpdate passport,
        Guid productId,
        Guid passportId,
        CancellationToken cancellationToken)
    {
        var entity = await _applicationContext.ProductPassports
            .SingleOrDefaultAsync(x => x.ProductId == productId && x.Id == passportId, cancellationToken) ?? throw NonOkHttpAnswerException.NotFound400();
        if (entity.Order == passport.Order)
        {
            return;
        }

        var minOrder = Math.Min(entity.Order, passport.Order);
        var maxOrder = Math.Max(entity.Order, passport.Order);

        var affected = await _applicationContext.ProductPassports
            .Where(x => x.ProductId == productId && x.Id != passportId && x.Order >= minOrder && x.Order <= maxOrder)
            .ToListAsync(cancellationToken);

        if (passport.Order < entity.Order)
        {
            foreach (var p in affected)
            {
                p.Order++;
            }
        }
        else
        {
            foreach (var p in affected)
            {
                p.Order--;
            }
        }

        entity.Order = passport.Order;
        _ = await _applicationContext.SaveChangesAsync(cancellationToken);
    }
}