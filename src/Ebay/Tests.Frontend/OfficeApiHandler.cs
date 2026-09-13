using System.Net;
using System.Net.Http.Json;
using Client.Clients.Generated;

namespace Tests.Frontend;

internal sealed class OfficeApiHandler : HttpMessageHandler
{
    public int PhotoCount { get; set; } = 2;

    protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var path = request.RequestUri?.AbsolutePath ?? throw new InvalidOperationException("Missing request URI.");
        object body;
        if (path.EndsWith("/lot-for-sales", StringComparison.Ordinal))
        {
            body = Array.Empty<LotForSaleResponse>();
        }
        else if (path.EndsWith("/tube_working_point/", StringComparison.Ordinal))
        {
            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.BadRequest));
        }
        else if (path.EndsWith("/measurements/", StringComparison.Ordinal))
        {
            body = new[]
            {
                new MeasurementData { MeasurementId = "MEA1234", MeasurementState = MeasurementState.Created, ProductState = ProductState.New },
                new MeasurementData { MeasurementId = "MEA5678", MeasurementState = MeasurementState.Created, ProductState = ProductState.New }
            };
        }
        else if (path.EndsWith("/measurements/photos/counts", StringComparison.Ordinal))
        {
            body = new[] { new { measurementId = "MEA1234", photoCount = PhotoCount } };
        }
        else
        {
            throw new InvalidOperationException($"Unexpected request: {request.Method} {path}");
        }
        return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK) { Content = JsonContent.Create(body) });
    }
}
