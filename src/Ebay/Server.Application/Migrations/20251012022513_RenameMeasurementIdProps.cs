using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class RenameMeasurementIdProps : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId1",
            table: "MatchedPairDifferences");

        _ = migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId2",
            table: "MatchedPairDifferences");

        _ = migrationBuilder.RenameColumn(
            name: "MeasurementId2",
            table: "MatchedPairDifferences",
            newName: "Measurement2Id");

        _ = migrationBuilder.RenameColumn(
            name: "MeasurementId1",
            table: "MatchedPairDifferences",
            newName: "Measurement1Id");

        _ = migrationBuilder.RenameIndex(
            name: "IX_MatchedPairDifferences_MeasurementId2",
            table: "MatchedPairDifferences",
            newName: "IX_MatchedPairDifferences_Measurement2Id");

        _ = migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement1Id",
            table: "MatchedPairDifferences",
            column: "Measurement1Id",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);

        _ = migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement2Id",
            table: "MatchedPairDifferences",
            column: "Measurement2Id",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement1Id",
            table: "MatchedPairDifferences");

        _ = migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement2Id",
            table: "MatchedPairDifferences");

        _ = migrationBuilder.RenameColumn(
            name: "Measurement2Id",
            table: "MatchedPairDifferences",
            newName: "MeasurementId2");

        _ = migrationBuilder.RenameColumn(
            name: "Measurement1Id",
            table: "MatchedPairDifferences",
            newName: "MeasurementId1");

        _ = migrationBuilder.RenameIndex(
            name: "IX_MatchedPairDifferences_Measurement2Id",
            table: "MatchedPairDifferences",
            newName: "IX_MatchedPairDifferences_MeasurementId2");

        _ = migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId1",
            table: "MatchedPairDifferences",
            column: "MeasurementId1",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);

        _ = migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId2",
            table: "MatchedPairDifferences",
            column: "MeasurementId2",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }
}
