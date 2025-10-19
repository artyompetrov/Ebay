using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddDDDProducts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RuSearchQueries_Products_ProductId",
                table: "RuSearchQueries");

            migrationBuilder.DropForeignKey(
                name: "FK_SearchQueries_Products_ProductId",
                table: "SearchQueries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SearchQueries",
                table: "SearchQueries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_RuSearchQueries",
                table: "RuSearchQueries");

            migrationBuilder.RenameTable(
                name: "SearchQueries",
                newName: "Product_SearchQueries");

            migrationBuilder.RenameTable(
                name: "RuSearchQueries",
                newName: "Product_RuSearchQueries");

            migrationBuilder.RenameIndex(
                name: "IX_SearchQueries_ProductId",
                table: "Product_SearchQueries",
                newName: "IX_Product_SearchQueries_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_RuSearchQueries_ProductId",
                table: "Product_RuSearchQueries",
                newName: "IX_Product_RuSearchQueries_ProductId");

            migrationBuilder.AddColumn<uint>(
                name: "xmin",
                table: "Products",
                type: "xid",
                rowVersion: true,
                nullable: false,
                defaultValue: 0u);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Product_SearchQueries",
                table: "Product_SearchQueries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Product_RuSearchQueries",
                table: "Product_RuSearchQueries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Product_RuSearchQueries_Products_ProductId",
                table: "Product_RuSearchQueries",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Product_SearchQueries_Products_ProductId",
                table: "Product_SearchQueries",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Product_RuSearchQueries_Products_ProductId",
                table: "Product_RuSearchQueries");

            migrationBuilder.DropForeignKey(
                name: "FK_Product_SearchQueries_Products_ProductId",
                table: "Product_SearchQueries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Product_SearchQueries",
                table: "Product_SearchQueries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Product_RuSearchQueries",
                table: "Product_RuSearchQueries");

            migrationBuilder.DropColumn(
                name: "xmin",
                table: "Products");

            migrationBuilder.RenameTable(
                name: "Product_SearchQueries",
                newName: "SearchQueries");

            migrationBuilder.RenameTable(
                name: "Product_RuSearchQueries",
                newName: "RuSearchQueries");

            migrationBuilder.RenameIndex(
                name: "IX_Product_SearchQueries_ProductId",
                table: "SearchQueries",
                newName: "IX_SearchQueries_ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_Product_RuSearchQueries_ProductId",
                table: "RuSearchQueries",
                newName: "IX_RuSearchQueries_ProductId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_SearchQueries",
                table: "SearchQueries",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_RuSearchQueries",
                table: "RuSearchQueries",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_RuSearchQueries_Products_ProductId",
                table: "RuSearchQueries",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SearchQueries_Products_ProductId",
                table: "SearchQueries",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
