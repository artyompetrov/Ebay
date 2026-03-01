using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AddPortsAndAdapters : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId1",
            table: "MatchedPairDifferences");

        migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId2",
            table: "MatchedPairDifferences");

        migrationBuilder.DropForeignKey(
            name: "FK_ProductMeasurements_Products_ProductId",
            table: "ProductMeasurements");

        migrationBuilder.DropForeignKey(
            name: "FK_TubeWorkingPoints_Products_ProductId",
            table: "TubeWorkingPoints");

        migrationBuilder.AddColumn<uint>(
            name: "xmin",
            table: "ProductMeasurements",
            type: "xid",
            rowVersion: true,
            nullable: false,
            defaultValue: 0u);

        migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId1",
            table: "MatchedPairDifferences",
            column: "MeasurementId1",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);

        migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId2",
            table: "MatchedPairDifferences",
            column: "MeasurementId2",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);

        migrationBuilder.AddForeignKey(
            name: "FK_ProductMeasurements_Products_ProductId",
            table: "ProductMeasurements",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);

        migrationBuilder.AddForeignKey(
            name: "FK_TubeWorkingPoints_Products_ProductId",
            table: "TubeWorkingPoints",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId1",
            table: "MatchedPairDifferences");

        migrationBuilder.DropForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId2",
            table: "MatchedPairDifferences");

        migrationBuilder.DropForeignKey(
            name: "FK_ProductMeasurements_Products_ProductId",
            table: "ProductMeasurements");

        migrationBuilder.DropForeignKey(
            name: "FK_TubeWorkingPoints_Products_ProductId",
            table: "TubeWorkingPoints");

        migrationBuilder.DropColumn(
            name: "xmin",
            table: "ProductMeasurements");

        migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId1",
            table: "MatchedPairDifferences",
            column: "MeasurementId1",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);

        migrationBuilder.AddForeignKey(
            name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId2",
            table: "MatchedPairDifferences",
            column: "MeasurementId2",
            principalTable: "ProductMeasurements",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);

        migrationBuilder.AddForeignKey(
            name: "FK_ProductMeasurements_Products_ProductId",
            table: "ProductMeasurements",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);

        migrationBuilder.AddForeignKey(
            name: "FK_TubeWorkingPoints_Products_ProductId",
            table: "TubeWorkingPoints",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    }
}