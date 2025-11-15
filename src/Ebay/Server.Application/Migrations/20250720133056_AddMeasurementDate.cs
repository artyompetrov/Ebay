using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddMeasurementDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "ProductMeasurements",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "CURRENT_TIMESTAMP");

            _ = migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_CreatedAt",
                table: "ProductMeasurements",
                column: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropIndex(
                name: "IX_ProductMeasurements_CreatedAt",
                table: "ProductMeasurements");

            _ = migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "ProductMeasurements");
        }
    }
}