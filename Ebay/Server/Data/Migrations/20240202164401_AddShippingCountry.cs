using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShippingCountry : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ShippingCountry",
                table: "Lots",
                type: "text",
                nullable: true);

            migrationBuilder.Sql(
                @"
UPDATE public.""Lots""
SET ""ShippingCountry"" = 'Germany'
WHERE 1=1
");

            migrationBuilder.AlterColumn<string>(
                name: "ShippingCountry",
                table: "Lots",
                type: "text",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ShippingCountry",
                table: "Lots");
        }
    }
}