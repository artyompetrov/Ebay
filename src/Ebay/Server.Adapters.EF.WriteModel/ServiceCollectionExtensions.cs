using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.EF.WriteModel.Repositories;
using Server.Application.Abstractions.Repositories;

namespace Server.Adapters.EF.WriteModel;

public static class ServiceCollectionExtensions
{
    public static void AddEfWriteModelAdapter(
        this IServiceCollection services)
    {
        services.AddScoped<IMeasurementRepository, MeasurementRepository>();
        services.AddScoped<IMatchedPairDifferenceRepository, MatchedPairDifferenceRepository>();
        services.AddScoped<ITubeWorkingPointsRepository, TubeWorkingPointsRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
    }
}