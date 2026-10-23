using AwesomeAssertions;
using Microsoft.EntityFrameworkCore;
using Server.Adapters.Driven.EF.WriteModel;
using Server.Domain.Product;

namespace Tests.Unit;

[TestFixture]
[TestOf(typeof(WriteModelDbContext))]
public sealed class WriteModelDbContextTests
{
    // Never opened: the guard fires before any database access.
    private const string UnreachableConnectionString = "Host=unreachable.invalid;Database=none";

    [Test]
    public async Task SaveChangesAsync_WithPendingDomainEvents_ThrowsInsteadOfDroppingEvents()
    {
        await using var dbContext = new WriteModelDbContext(
            new DbContextOptionsBuilder<WriteModelDbContext>().UseNpgsql(UnreachableConnectionString).Options);
        var product = Product.Create(
            name: "6N2P",
            weight: 1,
            searchQueries: [],
            ruSearchQueries: [],
            description: null);
        dbContext.Products.Add(product);

        var save = () => dbContext.SaveChangesAsync(CancellationToken.None);

        await save.Should().ThrowAsync<System.Diagnostics.UnreachableException>()
            .WithMessage("*WriteModelUnitOfWork*");
        product.HasEvents.Should().BeTrue();
    }
}
