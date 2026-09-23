using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class DropLegacyProductEmailSendHistoryAfterMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // "SaleAdvertisements" left in place intentionally, same as DropLegacyLotPurchaseCurrencyAfterMove:
            // ApplicationDbContext no longer maps ProductEmailSendHistory (moved to WriteModelDbContext's
            // "wm" schema as wm.ProductEmailSendHistories), but the legacy table stays until a deliberate
            // later migration drops it. Its FK to wm."Products" (added by MoveProductToWriteModel) stays too,
            // since nothing writes to this frozen legacy table anymore for it to incorrectly reject.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
