using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddSaleAdvertisements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductEmailSendHistory_ProductKey",
                table: "ProductEmailSendHistory");

            migrationBuilder.DropColumn(
                name: "ProductKey",
                table: "ProductEmailSendHistory");

            migrationBuilder.AddColumn<string>(
                name: "Seller",
                table: "ProductEmailSendHistory",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "ProductEmailSendHistory",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "ProductEmailSendHistory",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistory_ProductId",
                table: "ProductEmailSendHistory",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistory_ProductId_Seller",
                table: "ProductEmailSendHistory",
                columns: new[] { "ProductId", "Seller" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductEmailSendHistory_Products_ProductId",
                table: "ProductEmailSendHistory",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductEmailSendHistory_Products_ProductId",
                table: "ProductEmailSendHistory");

            migrationBuilder.DropIndex(
                name: "IX_ProductEmailSendHistory_ProductId",
                table: "ProductEmailSendHistory");

            migrationBuilder.DropIndex(
                name: "IX_ProductEmailSendHistory_ProductId_Seller",
                table: "ProductEmailSendHistory");

            migrationBuilder.DropColumn(
                name: "Link",
                table: "ProductEmailSendHistory");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "ProductEmailSendHistory");

            migrationBuilder.DropColumn(
                name: "Seller",
                table: "ProductEmailSendHistory");

            migrationBuilder.AddColumn<string>(
                name: "ProductKey",
                table: "ProductEmailSendHistory",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistory_ProductKey",
                table: "ProductEmailSendHistory",
                column: "ProductKey",
                unique: true);
        }
    }
}
