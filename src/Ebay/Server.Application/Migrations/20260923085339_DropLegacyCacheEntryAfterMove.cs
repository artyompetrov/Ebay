using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class DropLegacyCacheEntryAfterMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // "CacheEntries" left in place intentionally, same as DropLegacyLotPurchaseCurrencyAfterMove/
            // DropLegacyProductEmailSendHistoryAfterMove: ApplicationDbContext no longer maps CacheEntry
            // (moved to WriteModelDbContext's "wm" schema), but the legacy table stays until a deliberate
            // later migration drops it. Nothing else still-legacy references this table, so there is no
            // stale FK to drop either.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
