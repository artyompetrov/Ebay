using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AlterMatchedPairDifference2 : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.RenameColumn(
            name: "RmseSumm",
            table: "MatchedPairDifferences",
            newName: "RmseSection1");

        migrationBuilder.RenameColumn(
            name: "MseSumm",
            table: "MatchedPairDifferences",
            newName: "MseSection1");

        migrationBuilder.RenameColumn(
            name: "MaxAbs",
            table: "MatchedPairDifferences",
            newName: "MaxAbsSection1");

        migrationBuilder.AddColumn<double>(
            name: "MaxAbsSection2",
            table: "MatchedPairDifferences",
            type: "double precision",
            nullable: true);

        migrationBuilder.AddColumn<double>(
            name: "MseSection2",
            table: "MatchedPairDifferences",
            type: "double precision",
            nullable: true);

        migrationBuilder.AddColumn<double>(
            name: "RmseSection2",
            table: "MatchedPairDifferences",
            type: "double precision",
            nullable: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropColumn(
            name: "MaxAbsSection2",
            table: "MatchedPairDifferences");

        migrationBuilder.DropColumn(
            name: "MseSection2",
            table: "MatchedPairDifferences");

        migrationBuilder.DropColumn(
            name: "RmseSection2",
            table: "MatchedPairDifferences");

        migrationBuilder.RenameColumn(
            name: "RmseSection1",
            table: "MatchedPairDifferences",
            newName: "RmseSumm");

        migrationBuilder.RenameColumn(
            name: "MseSection1",
            table: "MatchedPairDifferences",
            newName: "MseSumm");

        migrationBuilder.RenameColumn(
            name: "MaxAbsSection1",
            table: "MatchedPairDifferences",
            newName: "MaxAbs");
    }
}