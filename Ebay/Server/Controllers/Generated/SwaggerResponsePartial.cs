using System.Net;

namespace Ebay.Server.Controllers.Generated;

public partial class SwaggerResponse
{
    public static SwaggerResponse Ok()
    {
        return new SwaggerResponse((int)HttpStatusCode.OK, new Dictionary<string, IEnumerable<string>>());
    }
    
    public static SwaggerResponse<T>Ok<T>(T result)
    {
        return new SwaggerResponse<T>((int)HttpStatusCode.OK, new Dictionary<string, IEnumerable<string>>(), result);
    }
    
    public static SwaggerResponse<T>Created<T>(T result)
    {
        return new SwaggerResponse<T>((int)HttpStatusCode.Created, new Dictionary<string, IEnumerable<string>>(), result);
    }
    
    public static SwaggerResponse NoContent()
    {
        return new SwaggerResponse((int)HttpStatusCode.NoContent, new Dictionary<string, IEnumerable<string>>());
    }
}