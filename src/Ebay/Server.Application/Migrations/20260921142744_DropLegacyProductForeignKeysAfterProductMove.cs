using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class DropLegacyProductForeignKeysAfterProductMove : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Product/Product_SearchQueries/Product_RuSearchQueries left in place intentionally, same as
            // EmptyMigrationAfterMeasurementAggregatesMove: ApplicationDbContext no longer maps Product
            // (moved to WriteModelDbContext's "wm" schema), but the legacy tables stay until a deliberate
            // later migration drops them. IX_Lots_ProductId is kept too - legacy code still filters
            // Lots by ProductId (e.g. price calculation, GetLotsAsync) and would lose that index otherwise.
            // Only the FKs to the now-stale legacy Products table are dropped: once cutover, new products
            // only exist in wm.Products, so these FKs would incorrectly reject legitimate new rows.
            migrationBuilder.DropForeignKey(
                name: "FK_IgnoredLots_Products_ProductId",
                table: "IgnoredLots");

            migrationBuilder.DropForeignKey(
                name: "FK_Lots_Products_ProductId",
                table: "Lots");

            migrationBuilder.DropForeignKey(
                name: "FK_ProductPassports_Products_ProductId",
                table: "ProductPassports");

            migrationBuilder.DropForeignKey(
                name: "FK_SaleAdvertisements_Products_ProductId",
                table: "SaleAdvertisements");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_IgnoredLots_Products_ProductId",
                table: "IgnoredLots",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Lots_Products_ProductId",
                table: "Lots",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_ProductPassports_Products_ProductId",
                table: "ProductPassports",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_SaleAdvertisements_Products_ProductId",
                table: "SaleAdvertisements",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
