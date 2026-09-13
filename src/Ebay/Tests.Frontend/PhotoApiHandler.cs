using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using Client.Clients.Generated;

namespace Tests.Frontend;

internal sealed class PhotoApiHandler : HttpMessageHandler
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web);
    public List<MeasurementPhotoResponse> Photos { get; } = [];
    public List<MeasurementPhotoUploadRequest> Uploads { get; } = [];
    public List<string> Requests { get; } = [];

    public Guid AddPhoto(string name)
    {
        var id = Guid.NewGuid();
        Photos.Add(new MeasurementPhotoResponse { Id = id, FileName = name, Order = Photos.Count });
        return id;
    }

    protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
    {
        var path = request.RequestUri?.AbsolutePath ?? throw new InvalidOperationException("Missing request URI.");
        Requests.Add($"{request.Method} {path}");
        if (request.Method == HttpMethod.Post && path.EndsWith("/photos", StringComparison.Ordinal))
        {
            var upload = await (request.Content ?? throw new InvalidOperationException("Missing upload body."))
                .ReadFromJsonAsync<MeasurementPhotoUploadRequest>(JsonOptions, cancellationToken)
                ?? throw new InvalidOperationException("Empty upload.");
            Uploads.Add(upload);
            AddPhoto(upload.FileName);
            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
        if (request.Method == HttpMethod.Delete)
        {
            var id = Guid.Parse(path.Split('/')[^1]);
            Photos.RemoveAll(x => x.Id == id);
            return new HttpResponseMessage(HttpStatusCode.NoContent);
        }
        if (request.Method == HttpMethod.Get && path.EndsWith("/photos", StringComparison.Ordinal))
        {
            return new HttpResponseMessage(HttpStatusCode.OK) { Content = JsonContent.Create(Photos) };
        }
        throw new InvalidOperationException($"Unexpected request: {request.Method} {path}");
    }
}
