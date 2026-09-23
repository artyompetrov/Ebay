using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class DropLegacyLotPurchaseCurrencyAfterMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Lots/Purchases/Currencies left in place intentionally, same as
            // EmptyMigrationAfterMeasurementAggregatesMove/DropLegacyProductForeignKeysAfterProductMove:
            // ApplicationDbContext no longer maps them (moved to WriteModelDbContext's "wm" schema), but the
            // legacy tables stay until a deliberate later migration drops them. Unlike Product, nothing else
            // still written through ApplicationDbContext references these three tables, so there is no stale
            // FK to drop here either - their own FKs (Lots -> Currencies, Purchases -> Lots) stay too, since
            // nothing writes to these frozen legacy tables anymore for them to incorrectly reject.
            // The hstore extension (used by Lots.Categories here) stays enabled too - WriteModelDbContext's
            // MoveLotPurchaseCurrencyToWriteModel migration also depends on it for wm.Lots.Categories.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
