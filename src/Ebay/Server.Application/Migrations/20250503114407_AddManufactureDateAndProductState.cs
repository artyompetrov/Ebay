using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddManufactureDateAndProductState : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "State",
                table: "ProductMeasurements",
                newName: "ProductState");

            migrationBuilder.AddColumn<string>(
                name: "ManufactureDate",
                table: "ProductMeasurements",
                type: "character varying(7)",
                maxLength: 7,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "MeasurementState",
                table: "ProductMeasurements",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ManufactureDate",
                table: "ProductMeasurements");

            migrationBuilder.DropColumn(
                name: "MeasurementState",
                table: "ProductMeasurements");

            migrationBuilder.RenameColumn(
                name: "ProductState",
                table: "ProductMeasurements",
                newName: "State");
        }
    }
}