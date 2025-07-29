namespace Server.Application.Services.Measurement;

/// <param name="Pmax">Максимальная мощность мВт</param>
public record MeasurementConfig(MeasurementType MeasurementType, int Pmax);