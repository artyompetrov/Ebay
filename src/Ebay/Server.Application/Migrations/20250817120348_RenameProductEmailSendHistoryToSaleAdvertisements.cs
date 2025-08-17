using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class RenameProductEmailSendHistoryToSaleAdvertisements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ProductEmailSendHistory",
                table: "ProductEmailSendHistory");

            migrationBuilder.DropIndex(
                name: "IX_ProductEmailSendHistory_ProductKey",
                table: "ProductEmailSendHistory");

            migrationBuilder.RenameTable(
                name: "ProductEmailSendHistory",
                newName: "SaleAdvertisements");

            migrationBuilder.AddColumn<string>(
                name: "Seller",
                table: "SaleAdvertisements",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "SaleAdvertisements",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "SaleAdvertisements",
                type: "text",
                nullable: true);

            migrationBuilder.Sql(@"UPDATE ""SaleAdvertisements"" SET ""Seller"" = split_part(""ProductKey"", '_', 1), ""ProductId"" = split_part(""ProductKey"", '_', 2)::uuid");

            migrationBuilder.Sql(@"UPDATE ""SaleAdvertisements"" SET ""Link"" = '' WHERE ""Link"" IS NULL");

            migrationBuilder.DropColumn(
                name: "ProductKey",
                table: "SaleAdvertisements");

            migrationBuilder.AlterColumn<string>(
                name: "Seller",
                table: "SaleAdvertisements",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "SaleAdvertisements",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Link",
                table: "SaleAdvertisements",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_SaleAdvertisements",
                table: "SaleAdvertisements",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_SaleAdvertisements_ProductId",
                table: "SaleAdvertisements",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_SaleAdvertisements_ProductId_Seller",
                table: "SaleAdvertisements",
                columns: new[] { "ProductId", "Seller" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleAdvertisements_Products_ProductId",
                table: "SaleAdvertisements",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SaleAdvertisements_Products_ProductId",
                table: "SaleAdvertisements");

            migrationBuilder.DropPrimaryKey(
                name: "PK_SaleAdvertisements",
                table: "SaleAdvertisements");

            migrationBuilder.DropIndex(
                name: "IX_SaleAdvertisements_ProductId",
                table: "SaleAdvertisements");

            migrationBuilder.DropIndex(
                name: "IX_SaleAdvertisements_ProductId_Seller",
                table: "SaleAdvertisements");

            migrationBuilder.AddColumn<string>(
                name: "ProductKey",
                table: "SaleAdvertisements",
                type: "text",
                nullable: true);

            migrationBuilder.Sql(@"UPDATE ""SaleAdvertisements"" SET ""ProductKey"" = LOWER(""Seller"") || '_' || ""ProductId""");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "SaleAdvertisements");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "SaleAdvertisements");

            migrationBuilder.DropColumn(
                name: "Seller",
                table: "SaleAdvertisements");

            migrationBuilder.AlterColumn<string>(
                name: "ProductKey",
                table: "SaleAdvertisements",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.RenameTable(
                name: "SaleAdvertisements",
                newName: "ProductEmailSendHistory");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProductEmailSendHistory",
                table: "ProductEmailSendHistory",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistory_ProductKey",
                table: "ProductEmailSendHistory",
                column: "ProductKey",
                unique: true);
        }
    }
}
