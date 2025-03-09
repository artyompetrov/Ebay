using Duende.IdentityServer.EntityFramework.Options;
using MassTransit;
using Server.Data.Models;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Server.Data;

internal class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.AddInboxStateEntity();
        modelBuilder.AddOutboxMessageEntity();
        modelBuilder.AddOutboxStateEntity();
    }
    
    public ApplicationDbContext(
        DbContextOptions options,
        IOptions<OperationalStoreOptions> operationalStoreOptions
    ) : base(options: options, operationalStoreOptions: operationalStoreOptions)
    {
    }

    public DbSet<Product> Products { get; set; } = null!;

    public DbSet<SearchQuery> SearchQueries { get; set; } = null!;
    
    public DbSet<RuSearchQuery> RuSearchQueries { get; set; } = null!;

    public DbSet<Lot> Lots { get; set; } = null!;

    public DbSet<IgnoredLot> IgnoredLots { get; set; } = null!;

    public DbSet<Purchase> Purchases { get; set; } = null!;

    public DbSet<ClientError> ClientErrors { get; set; } = null!;

    public DbSet<Currency> Currencies { get; set; } = null!;
}