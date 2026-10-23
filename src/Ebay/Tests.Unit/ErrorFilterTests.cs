using System.Diagnostics;
using AwesomeAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Abstractions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.DependencyInjection;
using Server.Adapters.Driving.WebApi.Controllers;
using Tests.Shared;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(ErrorFilter))]
public sealed class ErrorFilterTests
{
    private const string ExceptionEventName = "exception";
    private const string ExceptionTypeTag = "exception.type";
    private const string ExceptionMessageTag = "exception.message";
    private const int InternalServerErrorStatus = 500;

    [Test]
    [OpenSpecScenario("observability-tracing", "Failed spans carry their exception", "A request that fails with an unexpected error records its exception")]
    public void OnException_RecordsExceptionOnRequestSpan()
    {
        using var requestSpan = new Activity("request").Start();
        var exception = new InvalidOperationException($"unexpected-{Guid.NewGuid():N}");
        var context = CreateExceptionContext(requestSpan, exception);

        CreateFilter().OnException(context);

        requestSpan.Status.Should().Be(ActivityStatusCode.Error);
        var exceptionEvent = requestSpan.Events.Should().ContainSingle(static e => e.Name == ExceptionEventName).Subject;
        var tags = exceptionEvent.Tags.ToDictionary(static tag => tag.Key, static tag => tag.Value);
        tags[ExceptionTypeTag].Should().Be(typeof(InvalidOperationException).FullName);
        tags[ExceptionMessageTag].Should().Be(exception.Message);
        context.ExceptionHandled.Should().BeTrue();
        context.Result.Should().BeOfType<ObjectResult>().Which.StatusCode.Should().Be(InternalServerErrorStatus);
    }

    [Test]
    public void OnException_WithoutRequestSpan_StillAnswersTheError()
    {
        var context = CreateExceptionContext(requestSpan: null, new InvalidOperationException("unexpected"));

        CreateFilter().OnException(context);

        context.ExceptionHandled.Should().BeTrue();
        context.Result.Should().BeOfType<ObjectResult>().Which.StatusCode.Should().Be(InternalServerErrorStatus);
    }

    private static ErrorFilter CreateFilter()
    {
        var services = new ServiceCollection();
        services.AddControllers();
        using var provider = services.BuildServiceProvider();
        return new ErrorFilter(provider.GetRequiredService<ProblemDetailsFactory>());
    }

    private static ExceptionContext CreateExceptionContext(Activity? requestSpan, Exception exception)
    {
        var httpContext = new DefaultHttpContext();
        if (requestSpan is not null)
        {
            httpContext.Features.Set<IHttpActivityFeature>(new ActivityFeature(requestSpan));
        }

        var actionContext = new ActionContext(httpContext, new RouteData(), new ActionDescriptor());
        return new ExceptionContext(actionContext, []) { Exception = exception };
    }

    private sealed class ActivityFeature : IHttpActivityFeature
    {
        public ActivityFeature(Activity activity)
        {
            Activity = activity;
        }

        public Activity Activity { get; set; }
    }
}
