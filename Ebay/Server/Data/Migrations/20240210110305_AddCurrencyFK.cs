using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrencyFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Currency",
                table: "Lots",
                newName: "CurrencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Lots_CurrencyId",
                table: "Lots",
                column: "CurrencyId");

            migrationBuilder.AddForeignKey(
                name: "FK_Lots_Currencies_CurrencyId",
                table: "Lots",
                column: "CurrencyId",
                principalTable: "Currencies",
                principalColumn: "CurrencyEbayName",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Lots_Currencies_CurrencyId",
                table: "Lots");

            migrationBuilder.DropIndex(
                name: "IX_Lots_CurrencyId",
                table: "Lots");

            migrationBuilder.RenameColumn(
                name: "CurrencyId",
                table: "Lots",
                newName: "Currency");
        }
    }
}