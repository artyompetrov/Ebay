using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrencyRateTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Currencies",
                columns: table => new
                {
                    CurrencyEbayName = table.Column<string>(type: "text", nullable: false),
                    CurrencyRusName = table.Column<string>(type: "text", nullable: false),
                    CurrencyApiName = table.Column<string>(type: "text", nullable: false),
                    CurrencyRate = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currencies", x => x.CurrencyEbayName);
                });
            
            migrationBuilder.InsertData(
                "Currencies",
                new[] { "CurrencyEbayName", "CurrencyRusName", "CurrencyApiName", "CurrencyRate" },
                new object[] { "US $", "Доллар США", "USD", 1.0 });
            
            migrationBuilder.InsertData(
                "Currencies",
                new[] { "CurrencyEbayName", "CurrencyRusName", "CurrencyApiName", "CurrencyRate" },
                new object[] { "GBP", "Британский фунт", "KZT", 0.79 });
            
            migrationBuilder.InsertData(
                "Currencies",
                new[] { "CurrencyEbayName", "CurrencyRusName", "CurrencyApiName", "CurrencyRate" },
                new object[] { "RUB", "Рубль", "RUB", 90.991811 });
            
            migrationBuilder.InsertData(
                "Currencies",
                new[] { "CurrencyEbayName", "CurrencyRusName", "CurrencyApiName", "CurrencyRate" },
                new object[] { "KZT", "Тенге", "KZT", 452.193564 });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Currencies");
        }
    }
}
