using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations;

/// <inheritdoc />
public partial class AddHash : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AddColumn<string>(
            name: "HashAnodeCurves",
            table: "ProductMeasurements",
            type: "character varying(128)",
            maxLength: 128,
            nullable: false,
            defaultValue: "");

        _ = migrationBuilder.AddColumn<string>(
            name: "HashQuickTest",
            table: "ProductMeasurements",
            type: "character varying(128)",
            maxLength: 128,
            nullable: false,
            defaultValue: "");

        _ = migrationBuilder.CreateIndex(
            name: "IX_ProductMeasurements_HashAnodeCurves",
            table: "ProductMeasurements",
            column: "HashAnodeCurves",
            unique: true);

        _ = migrationBuilder.CreateIndex(
            name: "IX_ProductMeasurements_HashQuickTest",
            table: "ProductMeasurements",
            column: "HashQuickTest",
            unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropIndex(
            name: "IX_ProductMeasurements_HashAnodeCurves",
            table: "ProductMeasurements");

        _ = migrationBuilder.DropIndex(
            name: "IX_ProductMeasurements_HashQuickTest",
            table: "ProductMeasurements");

        _ = migrationBuilder.DropColumn(
            name: "HashAnodeCurves",
            table: "ProductMeasurements");

        _ = migrationBuilder.DropColumn(
            name: "HashQuickTest",
            table: "ProductMeasurements");
    }
}