using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AddDDDMigration : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_TubeWorkingPoints_Products_ProductId",
            table: "TubeWorkingPoints");

        migrationBuilder.DropPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences");

        migrationBuilder.RenameColumn(
            name: "ProductId",
            table: "TubeWorkingPoints",
            newName: "Id");

        migrationBuilder.AddColumn<uint>(
            name: "xmin",
            table: "TubeWorkingPoints",
            type: "xid",
            rowVersion: true,
            nullable: false,
            defaultValue: 0u);

        migrationBuilder.Sql(@"TRUNCATE TABLE ""MatchedPairDifferences"";");

        migrationBuilder.AddColumn<string>(
            name: "Id",
            table: "MatchedPairDifferences",
            type: "text",
            nullable: false,
            defaultValue: "");

        migrationBuilder.AddColumn<uint>(
            name: "xmin",
            table: "MatchedPairDifferences",
            type: "xid",
            rowVersion: true,
            nullable: false,
            defaultValue: 0u);



        migrationBuilder.AddPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences",
            column: "Id");

        migrationBuilder.CreateIndex(
            name: "IX_MatchedPairDifferences_Measurement1Id",
            table: "MatchedPairDifferences",
            column: "Measurement1Id");

        migrationBuilder.AddForeignKey(
            name: "FK_TubeWorkingPoints_Products_Id",
            table: "TubeWorkingPoints",
            column: "Id",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }
    private static readonly string[] columns = ["Measurement1Id", "Measurement2Id", "ComparisonMode"];

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropForeignKey(
            name: "FK_TubeWorkingPoints_Products_Id",
            table: "TubeWorkingPoints");

        migrationBuilder.DropPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences");

        migrationBuilder.DropIndex(
            name: "IX_MatchedPairDifferences_Measurement1Id",
            table: "MatchedPairDifferences");

        migrationBuilder.DropColumn(
            name: "xmin",
            table: "TubeWorkingPoints");

        migrationBuilder.DropColumn(
            name: "Id",
            table: "MatchedPairDifferences");

        migrationBuilder.DropColumn(
            name: "xmin",
            table: "MatchedPairDifferences");

        migrationBuilder.RenameColumn(
            name: "Id",
            table: "TubeWorkingPoints",
            newName: "ProductId");

        migrationBuilder.AddPrimaryKey(
            name: "PK_MatchedPairDifferences",
            table: "MatchedPairDifferences",
            columns: columns);

        migrationBuilder.AddForeignKey(
            name: "FK_TubeWorkingPoints_Products_ProductId",
            table: "TubeWorkingPoints",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Restrict);
    }
}
