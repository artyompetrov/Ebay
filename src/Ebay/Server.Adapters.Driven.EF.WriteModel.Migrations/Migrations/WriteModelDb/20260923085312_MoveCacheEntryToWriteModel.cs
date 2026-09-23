using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveCacheEntryToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CacheEntries",
                schema: "wm",
                columns: table => new
                {
                    Key = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Version = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    Value = table.Column<string>(type: "text", nullable: false),
                    ExpiresAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CacheEntries", x => new { x.Key, x.Version });
                });

            // CacheEntry has no owning behavior (design.md: a "mechanical copy" table) - copy existing rows
            // anyway for consistency with every other legacy-to-wm move, even though a stale/expired row here
            // is harmless (ExpiresAt governs staleness and the value just gets recomputed on next read).
            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."CacheEntries" ("Key", "Version", "Value", "ExpiresAt")
                     SELECT "Key", "Version", "Value", "ExpiresAt"
                     FROM "CacheEntries";
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CacheEntries",
                schema: "wm");
        }
    }
}
