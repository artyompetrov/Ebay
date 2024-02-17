using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNameAlteredDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "TitleChangeDate",
                table: "Lots",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.Sql(
                @"
UPDATE public.""Lots""
SET ""TitleChangeDate"" = TIMESTAMPTZ '1970-01-01 00:00:00Z'
WHERE 1=1
");
            
            migrationBuilder.AlterColumn<DateTime>(
                name: "TitleChangeDate",
                table: "Lots",
                type: "timestamp with time zone",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "TitleChangeDate",
                table: "Lots");
        }
    }
}
