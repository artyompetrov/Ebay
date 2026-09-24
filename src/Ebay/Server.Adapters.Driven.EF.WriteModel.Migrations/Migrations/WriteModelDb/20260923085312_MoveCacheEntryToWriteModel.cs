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
            // Guarded by a legacy-table existence check: no-op on a database bootstrapping this migration for
            // the first time (per task 7.6's removal of the legacy migration history that used to create this
            // table); harmless replay of an already-applied data copy otherwise.
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'CacheEntries') THEN
                             INSERT INTO wm."CacheEntries" ("Key", "Version", "Value", "ExpiresAt")
                             SELECT "Key", "Version", "Value", "ExpiresAt"
                             FROM "CacheEntries";
                         END IF;
                     END $$;
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
