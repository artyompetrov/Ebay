using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCurrency : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Lots",
                type: "text",
                nullable: true);

            migrationBuilder.Sql(
                @"
UPDATE public.""Lots""
SET ""Currency"" = 'US $'
WHERE 1=1
");

            migrationBuilder.AlterColumn<string>(
                name: "Currency",
                table: "Lots",
                type: "text",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Lots");
        }
    }
}