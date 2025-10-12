using Microsoft.Extensions.DependencyInjection;
using Server.Application.Abstractions;
using Server.Application.Abstractions.Repositories;
using Server.Domain.Measurements;

namespace Server.Adapters.EF.WriteModel;

public static class ServiceCollectionExtensions
{
    public static void AddEfWriteModelAdapter(
        this IServiceCollection services)
    {
        services.AddScoped<IMeasurementRepository, MeasurementRepository>();
        services.AddScoped<IMatchedPairDifferenceRepository, MatchedPairDifferenceRepository>();
        services.AddScoped<ITubeWorkingPointsRepository, TubeWorkingPointsRepository>();
    }
}