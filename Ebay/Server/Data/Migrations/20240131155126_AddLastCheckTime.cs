using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddLastCheckTime : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "LastCheckTime",
                table: "Products",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.Sql(
                @"
UPDATE public.""Products""
SET ""LastCheckTime"" = TIMESTAMPTZ '1970-01-01 00:00:00Z'
WHERE 1=1
"
            );

            migrationBuilder.AddColumn<DateTime>(
                name: "LastCheckTime",
                table: "Products",
                type: "timestamp with time zone",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LastCheckTime",
                table: "Products");
        }
    }
}