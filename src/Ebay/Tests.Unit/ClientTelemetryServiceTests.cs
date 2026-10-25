using AwesomeAssertions;
using Microsoft.Extensions.Logging.Abstractions;
using OneOf;
using OneOf.Types;
using Server.Application.Abstractions.Driven.Abstractions;
using Server.Application.ClientTelemetry;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ClientTelemetryService))]
public sealed class ClientTelemetryServiceTests
{
    [Test]
    public async Task ForwardAsync_BatchWithinLimit_ForwardsIdenticalBytes()
    {
        var adapter = new RecordingAdapter(new Success());
        var batch = Enumerable.Range(0, ClientTelemetryService.MaxBatchBytes).Select(static i => (byte)i).ToArray();

        var result = await new ClientTelemetryService(adapter, NullLogger<ClientTelemetryService>.Instance)
            .ForwardAsync(ClientTelemetrySignal.Logs, new MemoryStream(batch), declaredLength: null, CancellationToken.None);

        result.IsT0.Should().BeTrue();
        adapter.Signal.Should().Be(ClientTelemetrySignal.Logs);
        adapter.Batch.Should().Equal(batch);
    }

    [Test]
    public async Task ForwardAsync_DeclaredLengthOverLimit_ReturnsTooLargeWithoutReading()
    {
        var adapter = new RecordingAdapter(new Success());
        var body = new UnreadableStream();

        var result = await new ClientTelemetryService(adapter, NullLogger<ClientTelemetryService>.Instance)
            .ForwardAsync(ClientTelemetrySignal.Traces, body, ClientTelemetryService.MaxBatchBytes + 1L, CancellationToken.None);

        result.IsT1.Should().BeTrue();
        adapter.Calls.Should().Be(0);
    }

    [Test]
    public async Task ForwardAsync_UndeclaredBodyOverLimit_ReturnsTooLargeAndForwardsNothing()
    {
        var adapter = new RecordingAdapter(new Success());
        var body = new MemoryStream(new byte[ClientTelemetryService.MaxBatchBytes + 1]);

        var result = await new ClientTelemetryService(adapter, NullLogger<ClientTelemetryService>.Instance)
            .ForwardAsync(ClientTelemetrySignal.Traces, body, declaredLength: null, CancellationToken.None);

        result.IsT1.Should().BeTrue();
        adapter.Calls.Should().Be(0);
    }

    [Test]
    public async Task ForwardAsync_StoreRejects_ReturnsRejected()
    {
        var adapter = new RecordingAdapter(new ClientTelemetryBatchRejected("400"));

        var result = await new ClientTelemetryService(adapter, NullLogger<ClientTelemetryService>.Instance)
            .ForwardAsync(ClientTelemetrySignal.Traces, new MemoryStream([1]), declaredLength: 1, CancellationToken.None);

        result.IsT2.Should().BeTrue();
    }

    [Test]
    public async Task ForwardAsync_StoreFails_ReturnsError()
    {
        var adapter = new RecordingAdapter(new Error<string>("503"));

        var result = await new ClientTelemetryService(adapter, NullLogger<ClientTelemetryService>.Instance)
            .ForwardAsync(ClientTelemetrySignal.Traces, new MemoryStream([1]), declaredLength: 1, CancellationToken.None);

        result.IsT3.Should().BeTrue();
    }

    private sealed class RecordingAdapter : IClientTelemetryAdapter
    {
        private readonly OneOf<Success, ClientTelemetryBatchRejected, Error<string>> _answer;

        public RecordingAdapter(OneOf<Success, ClientTelemetryBatchRejected, Error<string>> answer)
        {
            _answer = answer;
        }

        public ClientTelemetrySignal? Signal { get; private set; }

        public byte[] Batch { get; private set; } = [];

        public int Calls { get; private set; }

        public Task<OneOf<Success, ClientTelemetryBatchRejected, Error<string>>> ForwardAsync(
            ClientTelemetrySignal signal,
            ReadOnlyMemory<byte> batch,
            CancellationToken cancellationToken)
        {
            Calls++;
            Signal = signal;
            Batch = batch.ToArray();
            return Task.FromResult(_answer);
        }
    }

    /// <summary>
    /// A body that must not be read at all.
    /// </summary>
    private sealed class UnreadableStream : MemoryStream
    {
        public override Task<int> ReadAsync(byte[] buffer, int offset, int count, CancellationToken cancellationToken) =>
            throw new AssertionException("The body was read.");

        public override ValueTask<int> ReadAsync(Memory<byte> buffer, CancellationToken cancellationToken = default) =>
            throw new AssertionException("The body was read.");
    }
}
