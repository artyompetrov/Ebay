using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class RemoveMarketplaceFromSaleAdsDateIndex : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SaleAdvertisements_Marketplace_CreatedAt",
                table: "SaleAdvertisements");

            migrationBuilder.CreateIndex(
                name: "IX_SaleAdvertisements_CreatedAt",
                table: "SaleAdvertisements",
                column: "CreatedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_SaleAdvertisements_CreatedAt",
                table: "SaleAdvertisements");

            migrationBuilder.CreateIndex(
                name: "IX_SaleAdvertisements_Marketplace_CreatedAt",
                table: "SaleAdvertisements",
                columns: new[] { "Marketplace", "CreatedAt" });
        }
    }
}
