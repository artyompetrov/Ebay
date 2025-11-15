using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddIndexOnMatchId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_MatchId",
                table: "ProductMeasurements",
                column: "MatchId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropIndex(
                name: "IX_ProductMeasurements_MatchId",
                table: "ProductMeasurements");
        }
    }
}