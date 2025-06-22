using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddPlateCurves : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HashPlateCurves",
                table: "ProductMeasurements",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_HashPlateCurves",
                table: "ProductMeasurements",
                column: "HashPlateCurves",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductMeasurements_HashPlateCurves",
                table: "ProductMeasurements");

            migrationBuilder.DropColumn(
                name: "HashPlateCurves",
                table: "ProductMeasurements");
        }
    }
}