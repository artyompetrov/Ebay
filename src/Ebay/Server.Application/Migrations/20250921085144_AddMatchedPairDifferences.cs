using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddMatchedPairDifferences : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MatchedPairDifferences",
                columns: table => new
                {
                    MeasurementId1 = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MeasurementId2 = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Mse = table.Column<double>(type: "double precision", nullable: false),
                    Rmse = table.Column<double>(type: "double precision", nullable: false),
                    MaxAbs = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchedPairDifferences", x => new { x.MeasurementId1, x.MeasurementId2 });
                    table.ForeignKey(
                        name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId1",
                        column: x => x.MeasurementId1,
                        principalTable: "ProductMeasurements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_MatchedPairDifferences_ProductMeasurements_MeasurementId2",
                        column: x => x.MeasurementId2,
                        principalTable: "ProductMeasurements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MatchedPairDifferences_MeasurementId2",
                table: "MatchedPairDifferences",
                column: "MeasurementId2");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchedPairDifferences");
        }
    }
}
