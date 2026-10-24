using System.ComponentModel.DataAnnotations;
using System.Globalization;
using AwesomeAssertions;
using Server.Adapters.Driven.NewAudioPortal;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(NewAudioPortalAdapterOptions))]
public sealed class NewAudioPortalAdapterOptionsTests
{
    [TestCase("")]
    [TestCase("   ")]
    [TestCase("/")]
    public void Validate_BlankSection_Fails(string section)
    {
        var options = new NewAudioPortalAdapterOptions { Sections = ["197-продам-радиолампы", section] };

        Validate(options).Should().ContainSingle()
            .Which.MemberNames.Should().Equal(nameof(NewAudioPortalAdapterOptions.Sections));
    }

    [Test]
    public void EffectiveSections_NoSections_FallsBackToTubesSection()
    {
        var options = new NewAudioPortalAdapterOptions();

        Validate(options).Should().BeEmpty();
        options.EffectiveSections.Should().Equal("197-продам-радиолампы");
    }

    [Test]
    public void EffectiveSections_ConfiguredSections_AreUsedAsIs()
    {
        var options = new NewAudioPortalAdapterOptions { Sections = ["197-продам-радиолампы", "198-other"] };

        Validate(options).Should().BeEmpty();
        options.EffectiveSections.Should().Equal("197-продам-радиолампы", "198-other");
    }

    [TestCase("-00:00:01")]
    [TestCase("00:10:01")]
    public void Validate_RequestDelayOutOfRange_Fails(string requestDelay)
    {
        Validate(new NewAudioPortalAdapterOptions { RequestDelay = TimeSpan.Parse(requestDelay, CultureInfo.InvariantCulture) }).Should().ContainSingle()
            .Which.MemberNames.Should().Equal(nameof(NewAudioPortalAdapterOptions.RequestDelay));
    }

    private static List<ValidationResult> Validate(NewAudioPortalAdapterOptions options)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(options, new ValidationContext(options), results, validateAllProperties: true);
        return results;
    }
}
