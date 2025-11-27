using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class ManufactureCode : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.RenameColumn(
            name: "ManufactureDate",
            table: "ProductMeasurements",
            newName: "ManufactureCode");

        _ = migrationBuilder.AlterColumn<string>(
            name: "ManufactureCode",
            table: "ProductMeasurements",
            type: "character varying(128)",
            maxLength: 128,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "character varying(7)",
            oldMaxLength: 7);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AlterColumn<string>(
            name: "ManufactureCode",
            table: "ProductMeasurements",
            type: "character varying(7)",
            maxLength: 7,
            nullable: false,
            oldClrType: typeof(string),
            oldType: "character varying(128)",
            oldMaxLength: 128);

        _ = migrationBuilder.RenameColumn(
            name: "ManufactureCode",
            table: "ProductMeasurements",
            newName: "ManufactureDate");
    }
}