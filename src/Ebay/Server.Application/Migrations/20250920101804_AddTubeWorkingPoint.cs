using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AddTubeWorkingPoint : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.CreateTable(
            name: "TubeWorkingPoints",
            columns: table => new
            {
                ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                AnodeVoltage = table.Column<double>(type: "double precision", nullable: false),
                GridVoltage = table.Column<double>(type: "double precision", nullable: false),
                AnodeVoltageHalfWidth = table.Column<double>(type: "double precision", nullable: false),
                GridVoltageHalfWidth = table.Column<double>(type: "double precision", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_TubeWorkingPoints", x => x.ProductId);
                _ = table.ForeignKey(
                    name: "FK_TubeWorkingPoints_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropTable(
            name: "TubeWorkingPoints");
    }
}