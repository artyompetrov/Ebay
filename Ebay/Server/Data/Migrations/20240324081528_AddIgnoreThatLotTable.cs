using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddIgnoreThatLotTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IgnoreThatLot",
                table: "Lots");

            migrationBuilder.CreateTable(
                name: "IgnoredLots",
                columns: table => new
                {
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    LotId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IgnoredLots", x => new { x.ProductId, x.LotId });
                    table.ForeignKey(
                        name: "FK_IgnoredLots_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "IgnoredLots");

            migrationBuilder.AddColumn<bool>(
                name: "IgnoreThatLot",
                table: "Lots",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
