using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AlterMatchedPairs : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences");

        migrationBuilder.RenameColumn(
            name: "Rmse",
            table: "MatchedPairDifferences",
            newName: "RmseSumm");

        migrationBuilder.RenameColumn(
            name: "Mse",
            table: "MatchedPairDifferences",
            newName: "MseSumm");

        migrationBuilder.AddColumn<int>(
            name: "ComparisonMode",
            table: "MatchedPairDifferences",
            type: "integer",
            nullable: false,
            defaultValue: 0);

        migrationBuilder.AddPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences",
            columns: ["MeasurementId1", "MeasurementId2", "ComparisonMode"]);
    }
    private static readonly string[] columns = ["MeasurementId1", "MeasurementId2"];

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences");

        migrationBuilder.DropColumn(
            name: "ComparisonMode",
            table: "MatchedPairDifferences");

        migrationBuilder.RenameColumn(
            name: "RmseSumm",
            table: "MatchedPairDifferences",
            newName: "Rmse");

        migrationBuilder.RenameColumn(
            name: "MseSumm",
            table: "MatchedPairDifferences",
            newName: "Mse");

        migrationBuilder.AddPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences",
            columns: columns);
    }
}