using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations;

/// <inheritdoc />
public partial class RenameGridCurves : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameColumn(
            name: "HashPlateCurves",
            table: "ProductMeasurements",
            newName: "HashGridCurves");

        migrationBuilder.RenameIndex(
            name: "IX_ProductMeasurements_HashPlateCurves",
            table: "ProductMeasurements",
            newName: "IX_ProductMeasurements_HashGridCurves");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameColumn(
            name: "HashGridCurves",
            table: "ProductMeasurements",
            newName: "HashPlateCurves");

        migrationBuilder.RenameIndex(
            name: "IX_ProductMeasurements_HashGridCurves",
            table: "ProductMeasurements",
            newName: "IX_ProductMeasurements_HashPlateCurves");
    }
}