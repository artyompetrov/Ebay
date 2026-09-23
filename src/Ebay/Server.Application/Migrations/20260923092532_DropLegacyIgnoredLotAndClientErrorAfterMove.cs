using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class DropLegacyIgnoredLotAndClientErrorAfterMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // "IgnoredLots"/"ClientErrors" left in place intentionally, same as every other legacy-to-wm move
            // this phase: ApplicationDbContext no longer maps IgnoredLot/ClientError (moved to
            // WriteModelDbContext's "wm" schema), but the legacy tables stay until a deliberate later
            // migration drops them. IgnoredLots' FK to wm."Products" (added by MoveProductToWriteModel) stays
            // too, since nothing writes to this frozen legacy table anymore for it to incorrectly reject.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
