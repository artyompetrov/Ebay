using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class RemoveQuickTest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductMeasurements_HashQuickTest",
                table: "ProductMeasurements");

            migrationBuilder.DropColumn(
                name: "HashQuickTest",
                table: "ProductMeasurements");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "HashQuickTest",
                table: "ProductMeasurements",
                type: "character varying(128)",
                maxLength: 128,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_HashQuickTest",
                table: "ProductMeasurements",
                column: "HashQuickTest",
                unique: true);
        }
    }
}
