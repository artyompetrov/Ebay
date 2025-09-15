using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddCacheEntryVersion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries");

            migrationBuilder.AddColumn<string>(
                name: "Version",
                table: "CacheEntries",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries",
                columns: new[] { "Key", "Version" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries");

            migrationBuilder.DropColumn(
                name: "Version",
                table: "CacheEntries");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries",
                column: "Key");
        }
    }
}