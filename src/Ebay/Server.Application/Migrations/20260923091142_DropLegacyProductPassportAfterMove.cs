using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class DropLegacyProductPassportAfterMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // "ProductPassports" left in place intentionally, same as every other legacy-to-wm move this phase:
            // ApplicationDbContext no longer maps ProductPassport (moved to WriteModelDbContext's "wm" schema),
            // but the legacy table stays until a deliberate later migration drops it. Its FK to wm."Products"
            // (added by MoveProductToWriteModel) stays too, since nothing writes to this frozen legacy table
            // anymore for it to incorrectly reject.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
