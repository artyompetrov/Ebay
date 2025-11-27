using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class RemoveGridCurvesHash : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropIndex(
            name: "IX_ProductMeasurements_HashGridCurves",
            table: "ProductMeasurements");

        _ = migrationBuilder.DropColumn(
            name: "HashGridCurves",
            table: "ProductMeasurements");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AddColumn<string>(
            name: "HashGridCurves",
            table: "ProductMeasurements",
            type: "character varying(128)",
            maxLength: 128,
            nullable: false,
            defaultValue: "");

        _ = migrationBuilder.CreateIndex(
            name: "IX_ProductMeasurements_HashGridCurves",
            table: "ProductMeasurements",
            column: "HashGridCurves",
            unique: true);
    }
}