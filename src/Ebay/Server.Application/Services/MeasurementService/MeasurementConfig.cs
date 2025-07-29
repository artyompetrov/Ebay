namespace Server.Application.Services.MeasurementService;

/// <param name="Pmax">Максимальная мощность мВт</param>
public record MeasurementConfig(MeasurementType MeasurementType, int Pmax);