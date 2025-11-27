using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations;

/// <inheritdoc />
public partial class AddManufactureDateAndProductState : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.RenameColumn(
            name: "State",
            table: "ProductMeasurements",
            newName: "ProductState");

        _ = migrationBuilder.AddColumn<string>(
            name: "ManufactureDate",
            table: "ProductMeasurements",
            type: "character varying(7)",
            maxLength: 7,
            nullable: false,
            defaultValue: "");

        _ = migrationBuilder.AddColumn<int>(
            name: "MeasurementState",
            table: "ProductMeasurements",
            type: "integer",
            nullable: false,
            defaultValue: 0);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropColumn(
            name: "ManufactureDate",
            table: "ProductMeasurements");

        _ = migrationBuilder.DropColumn(
            name: "MeasurementState",
            table: "ProductMeasurements");

        _ = migrationBuilder.RenameColumn(
            name: "ProductState",
            table: "ProductMeasurements",
            newName: "State");
    }
}
