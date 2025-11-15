using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AlterMatchedPairs : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.RenameColumn(
                name: "Rmse",
                table: "MatchedPairDifferences",
                newName: "RmseSumm");

            _ = migrationBuilder.RenameColumn(
                name: "Mse",
                table: "MatchedPairDifferences",
                newName: "MseSumm");

            _ = migrationBuilder.AddColumn<int>(
                name: "ComparisonMode",
                table: "MatchedPairDifferences",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences",
                columns: ["MeasurementId1", "MeasurementId2", "ComparisonMode"]);
        }
        private static readonly string[] columns = ["MeasurementId1", "MeasurementId2"];

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.DropColumn(
                name: "ComparisonMode",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.RenameColumn(
                name: "RmseSumm",
                table: "MatchedPairDifferences",
                newName: "Rmse");

            _ = migrationBuilder.RenameColumn(
                name: "MseSumm",
                table: "MatchedPairDifferences",
                newName: "Mse");

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences",
                columns: columns);
        }
    }
}