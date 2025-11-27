using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations;

/// <inheritdoc />
public partial class AddPlateCurves : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AddColumn<string>(
            name: "HashPlateCurves",
            table: "ProductMeasurements",
            type: "character varying(128)",
            maxLength: 128,
            nullable: false,
            defaultValue: "");

        _ = migrationBuilder.CreateIndex(
            name: "IX_ProductMeasurements_HashPlateCurves",
            table: "ProductMeasurements",
            column: "HashPlateCurves",
            unique: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropIndex(
            name: "IX_ProductMeasurements_HashPlateCurves",
            table: "ProductMeasurements");

        _ = migrationBuilder.DropColumn(
            name: "HashPlateCurves",
            table: "ProductMeasurements");
    }
}