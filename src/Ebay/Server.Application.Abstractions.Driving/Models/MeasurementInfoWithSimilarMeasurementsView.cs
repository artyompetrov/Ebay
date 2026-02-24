using Server.Application.Abstractions.Driven.Models;

namespace Server.Application.Abstractions.Driving.Models;

public record MeasurementInfoWithSimilarMeasurementsView(MeasurementInfoWithSimilarMeasurements Data, bool IsPublishedOnEbay);