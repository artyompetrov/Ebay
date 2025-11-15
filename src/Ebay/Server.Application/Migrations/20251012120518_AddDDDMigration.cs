using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddDDDMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropForeignKey(
                name: "FK_TubeWorkingPoints_Products_ProductId",
                table: "TubeWorkingPoints");

            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "TubeWorkingPoints",
                newName: "Id");

            _ = migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "TubeWorkingPoints",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            _ = migrationBuilder.Sql(@"TRUNCATE TABLE ""MatchedPairDifferences"";");

            _ = migrationBuilder.AddColumn<string>(
                name: "Id",
                table: "MatchedPairDifferences",
                type: "text",
                nullable: false,
                defaultValue: "");

            _ = migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "MatchedPairDifferences",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);



            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences",
                column: "Id");

            _ = migrationBuilder.CreateIndex(
                name: "IX_MatchedPairDifferences_Measurement1Id",
                table: "MatchedPairDifferences",
                column: "Measurement1Id");

            _ = migrationBuilder.AddForeignKey(
                name: "FK_TubeWorkingPoints_Products_Id",
                table: "TubeWorkingPoints",
                column: "Id",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropForeignKey(
                name: "FK_TubeWorkingPoints_Products_Id",
                table: "TubeWorkingPoints");

            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.DropIndex(
                name: "IX_MatchedPairDifferences_Measurement1Id",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.DropColumn(
                name: "xmin",
                table: "TubeWorkingPoints");

            _ = migrationBuilder.DropColumn(
                name: "Id",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.DropColumn(
                name: "xmin",
                table: "MatchedPairDifferences");

            _ = migrationBuilder.RenameColumn(
                name: "Id",
                table: "TubeWorkingPoints",
                newName: "ProductId");

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_MatchedPairDifferences",
                table: "MatchedPairDifferences",
                columns: new[] { "Measurement1Id", "Measurement2Id", "ComparisonMode" });

            _ = migrationBuilder.AddForeignKey(
                name: "FK_TubeWorkingPoints_Products_ProductId",
                table: "TubeWorkingPoints",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}