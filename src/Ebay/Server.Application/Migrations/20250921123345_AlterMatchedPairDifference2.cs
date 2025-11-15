using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AlterMatchedPairDifference2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.RenameColumn(
                name: "RmseSumm",
                table: "MatchedPairDifferences",
                newName: "RmseSection1");

            _ = migrationBuilder.RenameColumn(
                name: "MseSumm",
                table: "MatchedPairDifferences",
                newName: "MseSection1");

            _ = migrationBuilder.RenameColumn(
                name: "MaxAbs",
                table: "MatchedPairDifferences",
                newName: "MaxAbsSection1");

            _ = migrationBuilder.AddColumn<double>(
                name: "MaxAbsSection2",
                table: "MatchedPairDifferences",
                type: "double precision",
                nullable: true);

            _ = migrationBuilder.AddColumn<double>(
                name: "MseSection2",
                table: "MatchedPairDifferences",
                type: "double precision",
                nullable: true);

            _ = migrationBuilder.AddColumn<double>(
                name: "RmseSection2",
                table: "MatchedPairDifferences",
                type: "double precision",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropColumn(
                name: "MaxAbsSection2",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.DropColumn(
                name: "MseSection2",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.DropColumn(
                name: "RmseSection2",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.RenameColumn(
                name: "RmseSection1",
                table: "MatchedPairDifferences",
                newName: "RmseSumm");

            _ = migrationBuilder.RenameColumn(
                name: "MseSection1",
                table: "MatchedPairDifferences",
                newName: "MseSumm");

            _ = migrationBuilder.RenameColumn(
                name: "MaxAbsSection1",
                table: "MatchedPairDifferences",
                newName: "MaxAbs");
        }
    }
}