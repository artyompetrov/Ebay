using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations;

/// <inheritdoc />
public partial class AddHash : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.AddColumn<string>(
            name: "HashAnodeCurves",
            table: "ProductMeasurements",
            type: "character varying(128)",
            maxLength: 128,
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<string>(
            name: "HashQuickTest",
            table: "ProductMeasurements",
            type: "character varying(128)",
            maxLength: 128,
            nullable: false,
            defaultValue: "");

        migrationBuilder.CreateIndex(
            name: "IX_ProductMeasurements_HashAnodeCurves",
            table: "ProductMeasurements",
            column: "HashAnodeCurves",
            unique: true);

        migrationBuilder.CreateIndex(
            name: "IX_ProductMeasurements_HashQuickTest",
            table: "ProductMeasurements",
            column: "HashQuickTest",
            unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropIndex(
            name: "IX_ProductMeasurements_HashAnodeCurves",
            table: "ProductMeasurements");

        migrationBuilder.DropIndex(
            name: "IX_ProductMeasurements_HashQuickTest",
            table: "ProductMeasurements");

        migrationBuilder.DropColumn(
            name: "HashAnodeCurves",
            table: "ProductMeasurements");

        migrationBuilder.DropColumn(
            name: "HashQuickTest",
            table: "ProductMeasurements");
    }
}