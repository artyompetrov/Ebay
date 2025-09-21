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
                    MeasurementId1 = table.Column<string>(type: "text", nullable: false),
                    MeasurementId2 = table.Column<string>(type: "text", nullable: false),
                    Mse = table.Column<double>(type: "double precision", nullable: false),
                    Rmse = table.Column<double>(type: "double precision", nullable: false),
                    MaxAbs = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchedPairDifferences", x => new { x.MeasurementId1, x.MeasurementId2 });
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchedPairDifferences");
        }
    }
}
