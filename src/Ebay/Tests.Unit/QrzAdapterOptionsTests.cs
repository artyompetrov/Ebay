using System.ComponentModel.DataAnnotations;
using System.Globalization;
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

    [TestCase(0)]
    [TestCase(101)]
    public void Validate_MaxListPagesOutOfRange_Fails(int maxListPages)
    {
        Validate(new QrzAdapterOptions { MaxListPages = maxListPages }).Should().ContainSingle()
            .Which.MemberNames.Should().Equal(nameof(QrzAdapterOptions.MaxListPages));
    }

    [TestCase("00:29:00")]
    [TestCase("7.00:01:00")]
    public void Validate_ListLookbackOutOfRange_Fails(string listLookback)
    {
        Validate(new QrzAdapterOptions { ListLookback = TimeSpan.Parse(listLookback, CultureInfo.InvariantCulture) }).Should().ContainSingle()
            .Which.MemberNames.Should().Equal(nameof(QrzAdapterOptions.ListLookback));
    }

    private static List<ValidationResult> Validate(QrzAdapterOptions options)
    {
        var results = new List<ValidationResult>();
        Validator.TryValidateObject(options, new ValidationContext(options), results, validateAllProperties: true);
        return results;
    }
}
