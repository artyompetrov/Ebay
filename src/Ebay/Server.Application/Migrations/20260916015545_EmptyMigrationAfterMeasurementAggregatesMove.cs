using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class EmptyMigrationAfterMeasurementAggregatesMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ProductMeasurements/TubeWorkingPoints/MatchedPairDifferences left in place intentionally:
            // ApplicationDbContext no longer maps them (moved to WriteModelDbContext's "wm" schema),
            // but the legacy tables stay until a deliberate later migration drops them.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
