namespace Client.Telemetry;

internal sealed record SerializedBatch(byte[] Body, int ItemCount);
