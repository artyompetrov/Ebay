using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driven.EF.WriteModel.Repositories;
using Server.Application.Abstractions.Driven.Abstractions.Abstractions.Repositories;

namespace Server.Adapters.Driven.EF.WriteModel;

public static class ServiceCollectionExtensions
{
    public static void AddEfWriteModelAdapter(
        this IServiceCollection services)
    {
        _ = services.AddScoped<IMeasurementRepository, MeasurementRepository>();
        _ = services.AddScoped<IMatchedPairDifferenceRepository, MatchedPairDifferenceRepository>();
        _ = services.AddScoped<ITubeWorkingPointsRepository, TubeWorkingPointsRepository>();
        _ = services.AddScoped<IProductRepository, ProductRepository>();
        _ = services.AddScoped<ILotForSaleRepository, LotForSaleRepository>();
    }
}