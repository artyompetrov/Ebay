using Microsoft.EntityFrameworkCore;
using Server.Domain.LotForSale;

namespace Server.Adapters.Driven.EF.WriteModel;

public sealed class WriteModelDbContext : DbContext
{
    public WriteModelDbContext(DbContextOptions<WriteModelDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        _ = modelBuilder.HasDefaultSchema("wm");

        _ = modelBuilder.Entity<LotForSale>(entity =>
        {
            _ = entity.HasKey(x => x.Id);

            _ = entity.Property(x => x.Id)
                .HasMaxLength(7)
                .ValueGeneratedNever();

            _ = entity.Property(x => x.Name)
                .IsRequired();
        });
    }

    public DbSet<LotForSale> LotForSales { get; set; } = null!;
}
