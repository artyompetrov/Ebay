using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddCacheEntryVersion : Migration
    {
        private static readonly string[] columns = new[] { "Key", "Version" };

        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries");

            _ = migrationBuilder.AddColumn<string>(
                name: "Version",
                table: "CacheEntries",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "");

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries",
                columns: columns);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries");

            _ = migrationBuilder.DropColumn(
                name: "Version",
                table: "CacheEntries");

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_CacheEntries",
                table: "CacheEntries",
                column: "Key");
        }
    }
}