using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class SplitSaleAdvertisementSellerKeyAndName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductEmailSendHistories_ProductId_Seller_Marketplace",
                schema: "wm",
                table: "ProductEmailSendHistories");

            migrationBuilder.RenameColumn(
                name: "Seller",
                schema: "wm",
                table: "ProductEmailSendHistories",
                newName: "SellerName");

            migrationBuilder.AddColumn<string>(
                name: "SellerKey",
                schema: "wm",
                table: "ProductEmailSendHistories",
                type: "text",
                nullable: false,
                defaultValue: "");

            // Hand-added: existing rows keep their former Seller value (the dedup key) as both key and display name,
            // otherwise every row would get an empty key and the unique index below would fail.
            migrationBuilder.Sql("""UPDATE wm."ProductEmailSendHistories" SET "SellerKey" = "SellerName";""");

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistories_ProductId_SellerKey_Marketplace",
                schema: "wm",
                table: "ProductEmailSendHistories",
                columns: new[] { "ProductId", "SellerKey", "Marketplace" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_ProductEmailSendHistories_ProductId_SellerKey_Marketplace",
                schema: "wm",
                table: "ProductEmailSendHistories");

            // Hand-added: the previous schema's Seller column held the dedup key, so restore it from SellerKey.
            migrationBuilder.Sql("""UPDATE wm."ProductEmailSendHistories" SET "SellerName" = "SellerKey";""");

            migrationBuilder.DropColumn(
                name: "SellerKey",
                schema: "wm",
                table: "ProductEmailSendHistories");

            migrationBuilder.RenameColumn(
                name: "SellerName",
                schema: "wm",
                table: "ProductEmailSendHistories",
                newName: "Seller");

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistories_ProductId_Seller_Marketplace",
                schema: "wm",
                table: "ProductEmailSendHistories",
                columns: new[] { "ProductId", "Seller", "Marketplace" },
                unique: true);
        }
    }
}
