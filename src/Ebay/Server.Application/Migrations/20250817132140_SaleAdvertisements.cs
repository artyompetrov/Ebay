using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class SaleAdvertisements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_ProductEmailSendHistory",
                table: "ProductEmailSendHistory");

            _ = migrationBuilder.DropIndex(
                name: "IX_ProductEmailSendHistory_ProductKey",
                table: "ProductEmailSendHistory");

            _ = migrationBuilder.RenameTable(
                name: "ProductEmailSendHistory",
                newName: "SaleAdvertisements");

            _ = migrationBuilder.AddColumn<string>(
                name: "Seller",
                table: "SaleAdvertisements",
                type: "text",
                nullable: true);

            _ = migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "SaleAdvertisements",
                type: "uuid",
                nullable: true);

            _ = migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "SaleAdvertisements",
                type: "text",
                nullable: true);

            _ = migrationBuilder.AddColumn<string>(
                name: "Marketplace",
                table: "SaleAdvertisements",
                type: "text",
                nullable: true);

            _ = migrationBuilder.Sql(@"UPDATE ""SaleAdvertisements"" SET ""Seller"" = split_part(""ProductKey"", '_', 1), ""ProductId"" = split_part(""ProductKey"", '_', 2)::uuid");

            _ = migrationBuilder.Sql(@"UPDATE ""SaleAdvertisements"" SET ""Link"" = '' WHERE ""Link"" IS NULL");

            _ = migrationBuilder.Sql(@"UPDATE ""SaleAdvertisements"" SET ""Marketplace"" = 'Chipfind'");

            _ = migrationBuilder.DropColumn(
                name: "ProductKey",
                table: "SaleAdvertisements");

            _ = migrationBuilder.AlterColumn<string>(
                name: "Seller",
                table: "SaleAdvertisements",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            _ = migrationBuilder.AlterColumn<Guid>(
                name: "ProductId",
                table: "SaleAdvertisements",
                type: "uuid",
                nullable: false,
                oldClrType: typeof(Guid),
                oldType: "uuid",
                oldNullable: true);

            _ = migrationBuilder.AlterColumn<string>(
                name: "Link",
                table: "SaleAdvertisements",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            _ = migrationBuilder.AlterColumn<string>(
                name: "Marketplace",
                table: "SaleAdvertisements",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_SaleAdvertisements",
                table: "SaleAdvertisements",
                column: "Id");

            _ = migrationBuilder.CreateIndex(
                name: "IX_SaleAdvertisements_ProductId",
                table: "SaleAdvertisements",
                column: "ProductId");

            _ = migrationBuilder.CreateIndex(
                name: "IX_SaleAdvertisements_ProductId_Seller_Marketplace",
                table: "SaleAdvertisements",
                columns: new[] { "ProductId", "Seller", "Marketplace" },
                unique: true);

            _ = migrationBuilder.CreateIndex(
                name: "IX_SaleAdvertisements_CreatedAt",
                table: "SaleAdvertisements",
                column: "CreatedAt");

            _ = migrationBuilder.AddForeignKey(
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
            _ = migrationBuilder.DropForeignKey(
                name: "FK_SaleAdvertisements_Products_ProductId",
                table: "SaleAdvertisements");

            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_SaleAdvertisements",
                table: "SaleAdvertisements");

            _ = migrationBuilder.DropIndex(
                name: "IX_SaleAdvertisements_ProductId",
                table: "SaleAdvertisements");

            _ = migrationBuilder.DropIndex(
                name: "IX_SaleAdvertisements_ProductId_Seller_Marketplace",
                table: "SaleAdvertisements");

            _ = migrationBuilder.DropIndex(
                name: "IX_SaleAdvertisements_CreatedAt",
                table: "SaleAdvertisements");

            _ = migrationBuilder.AddColumn<string>(
                name: "ProductKey",
                table: "SaleAdvertisements",
                type: "text",
                nullable: true);

            _ = migrationBuilder.Sql(@"UPDATE ""SaleAdvertisements"" SET ""ProductKey"" = LOWER(""Seller"") || '_' || ""ProductId""");

            _ = migrationBuilder.DropColumn(
                name: "Link",
                table: "SaleAdvertisements");

            _ = migrationBuilder.DropColumn(
                name: "ProductId",
                table: "SaleAdvertisements");

            _ = migrationBuilder.DropColumn(
                name: "Seller",
                table: "SaleAdvertisements");

            _ = migrationBuilder.DropColumn(
                name: "Marketplace",
                table: "SaleAdvertisements");

            _ = migrationBuilder.AlterColumn<string>(
                name: "ProductKey",
                table: "SaleAdvertisements",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            _ = migrationBuilder.RenameTable(
                name: "SaleAdvertisements",
                newName: "ProductEmailSendHistory");

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_ProductEmailSendHistory",
                table: "ProductEmailSendHistory",
                column: "Id");

            _ = migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistory_ProductKey",
                table: "ProductEmailSendHistory",
                column: "ProductKey",
                unique: true);
        }
    }
}