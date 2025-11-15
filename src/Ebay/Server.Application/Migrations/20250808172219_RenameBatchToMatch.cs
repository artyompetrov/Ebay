using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class RenameBatchToMatch : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.RenameColumn(
                name: "BatchId",
                table: "ProductMeasurements",
                newName: "MatchId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.RenameColumn(
                name: "MatchId",
                table: "ProductMeasurements",
                newName: "BatchId");
        }
    }
}