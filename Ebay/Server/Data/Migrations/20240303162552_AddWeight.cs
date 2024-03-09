using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddWeight : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Weight",
                table: "Products",
                type: "integer",
                nullable: false,
                defaultValue: 30);

            migrationBuilder.AlterColumn<int>(
                name: "Weight",
                table: "Products",
                type: "integer",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Weight",
                table: "Products");
        }
    }
}