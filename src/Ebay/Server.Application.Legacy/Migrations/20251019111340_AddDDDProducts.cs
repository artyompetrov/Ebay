using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AddDDDProducts : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropForeignKey(
            name: "FK_RuSearchQueries_Products_ProductId",
            table: "RuSearchQueries");

        _ = migrationBuilder.DropForeignKey(
            name: "FK_SearchQueries_Products_ProductId",
            table: "SearchQueries");

        _ = migrationBuilder.DropPrimaryKey(
            name: "PK_SearchQueries",
            table: "SearchQueries");

        _ = migrationBuilder.DropPrimaryKey(
            name: "PK_RuSearchQueries",
            table: "RuSearchQueries");

        _ = migrationBuilder.RenameTable(
            name: "SearchQueries",
            newName: "Product_SearchQueries");

        _ = migrationBuilder.RenameTable(
            name: "RuSearchQueries",
            newName: "Product_RuSearchQueries");

        _ = migrationBuilder.RenameIndex(
            name: "IX_SearchQueries_ProductId",
            table: "Product_SearchQueries",
            newName: "IX_Product_SearchQueries_ProductId");

        _ = migrationBuilder.RenameIndex(
            name: "IX_RuSearchQueries_ProductId",
            table: "Product_RuSearchQueries",
            newName: "IX_Product_RuSearchQueries_ProductId");

        _ = migrationBuilder.AddColumn<uint>(
            name: "xmin",
            table: "Products",
            type: "xid",
            rowVersion: true,
            nullable: false,
            defaultValue: 0u);

        _ = migrationBuilder.AddPrimaryKey(
            name: "PK_Product_SearchQueries",
            table: "Product_SearchQueries",
            column: "Id");

        _ = migrationBuilder.AddPrimaryKey(
            name: "PK_Product_RuSearchQueries",
            table: "Product_RuSearchQueries",
            column: "Id");

        _ = migrationBuilder.AddForeignKey(
            name: "FK_Product_RuSearchQueries_Products_ProductId",
            table: "Product_RuSearchQueries",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);

        _ = migrationBuilder.AddForeignKey(
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
        _ = migrationBuilder.DropForeignKey(
            name: "FK_Product_RuSearchQueries_Products_ProductId",
            table: "Product_RuSearchQueries");

        _ = migrationBuilder.DropForeignKey(
            name: "FK_Product_SearchQueries_Products_ProductId",
            table: "Product_SearchQueries");

        _ = migrationBuilder.DropPrimaryKey(
            name: "PK_Product_SearchQueries",
            table: "Product_SearchQueries");

        _ = migrationBuilder.DropPrimaryKey(
            name: "PK_Product_RuSearchQueries",
            table: "Product_RuSearchQueries");

        _ = migrationBuilder.DropColumn(
            name: "xmin",
            table: "Products");

        _ = migrationBuilder.RenameTable(
            name: "Product_SearchQueries",
            newName: "SearchQueries");

        _ = migrationBuilder.RenameTable(
            name: "Product_RuSearchQueries",
            newName: "RuSearchQueries");

        _ = migrationBuilder.RenameIndex(
            name: "IX_Product_SearchQueries_ProductId",
            table: "SearchQueries",
            newName: "IX_SearchQueries_ProductId");

        _ = migrationBuilder.RenameIndex(
            name: "IX_Product_RuSearchQueries_ProductId",
            table: "RuSearchQueries",
            newName: "IX_RuSearchQueries_ProductId");

        _ = migrationBuilder.AddPrimaryKey(
            name: "PK_SearchQueries",
            table: "SearchQueries",
            column: "Id");

        _ = migrationBuilder.AddPrimaryKey(
            name: "PK_RuSearchQueries",
            table: "RuSearchQueries",
            column: "Id");

        _ = migrationBuilder.AddForeignKey(
            name: "FK_RuSearchQueries_Products_ProductId",
            table: "RuSearchQueries",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);

        _ = migrationBuilder.AddForeignKey(
            name: "FK_SearchQueries_Products_ProductId",
            table: "SearchQueries",
            column: "ProductId",
            principalTable: "Products",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    }
}