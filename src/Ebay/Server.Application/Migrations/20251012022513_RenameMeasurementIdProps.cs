using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class RenameMeasurementIdProps : Migration
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

            migrationBuilder.RenameColumn(
                name: "MeasurementId2",
                table: "MatchedPairDifferences",
                newName: "Measurement2Id");

            migrationBuilder.RenameColumn(
                name: "MeasurementId1",
                table: "MatchedPairDifferences",
                newName: "Measurement1Id");

            migrationBuilder.RenameIndex(
                name: "IX_MatchedPairDifferences_MeasurementId2",
                table: "MatchedPairDifferences",
                newName: "IX_MatchedPairDifferences_Measurement2Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement1Id",
                table: "MatchedPairDifferences",
                column: "Measurement1Id",
                principalTable: "ProductMeasurements",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
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
            migrationBuilder.DropForeignKey(
                name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement1Id",
                table: "MatchedPairDifferences");

            migrationBuilder.DropForeignKey(
                name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement2Id",
                table: "MatchedPairDifferences");

            migrationBuilder.RenameColumn(
                name: "Measurement2Id",
                table: "MatchedPairDifferences",
                newName: "MeasurementId2");

            migrationBuilder.RenameColumn(
                name: "Measurement1Id",
                table: "MatchedPairDifferences",
                newName: "MeasurementId1");

            migrationBuilder.RenameIndex(
                name: "IX_MatchedPairDifferences_Measurement2Id",
                table: "MatchedPairDifferences",
                newName: "IX_MatchedPairDifferences_MeasurementId2");

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
        }
    }
}