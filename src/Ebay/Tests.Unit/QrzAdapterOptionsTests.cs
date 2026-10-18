using System.ComponentModel.DataAnnotations;
using AwesomeAssertions;
using Server.Adapters.Driven.Qrz;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(QrzAdapterOptions))]
public sealed class QrzAdapterOptionsTests
{
    [TestCase("")]
    [TestCase("   ")]
    [TestCase("/")]
    public void Validate_BlankCategory_Fails(string category)
    {
        var options = new QrzAdapterOptions { Categories = ["components/tubes", category] };

        Validate(options).Should().ContainSingle()
            .Which.MemberNames.Should().Equal(nameof(QrzAdapterOptions.Categories));
    }

    [Test]
    public void Validate_NoCategories_Passes()
    {
        Validate(new QrzAdapterOptions()).Should().BeEmpty();
    }

    [Test]
    public void Validate_ConfiguredCategories_Passes()
    {
        Validate(new QrzAdapterOptions { Categories = ["components/tubes", "components/other"] }).Should().BeEmpty();
    }

    private static List<ValidationResult> Validate(QrzAdapterOptions options)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(options, new ValidationContext(options), results, validateAllProperties: true);
        return results;
    }
}
