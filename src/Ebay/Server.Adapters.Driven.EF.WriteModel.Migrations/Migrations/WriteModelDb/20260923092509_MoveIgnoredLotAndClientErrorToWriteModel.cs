using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveIgnoredLotAndClientErrorToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ClientErrors",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false),
                    ErrorText = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientErrors", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IgnoredLots",
                schema: "wm",
                columns: table => new
                {
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    LotId = table.Column<long>(type: "bigint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IgnoredLots", x => new { x.ProductId, x.LotId });
                    table.ForeignKey(
                        name: "FK_IgnoredLots_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "wm",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // Both are "no behavior" mechanical copies per design.md. ClientError has no CreatedAt/ChangedAt in
            // the legacy schema (a pure write sink, never read back) - backfilled to now(), same as
            // ProductPassport. IgnoredLot never carried any date field.
            // Guarded by legacy-table existence checks: no-op on a database bootstrapping this migration for
            // the first time (per task 7.6's removal of the legacy migration history that used to create these
            // tables); harmless replay of already-applied data copies otherwise.
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'ClientErrors') THEN
                             INSERT INTO wm."ClientErrors" ("Id", "Url", "ErrorText", "CreatedAt", "ChangedAt")
                             SELECT "Id", "Url", "ErrorText", now(), now()
                             FROM "ClientErrors";
                         END IF;
                     END $$;
                     """);

            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'IgnoredLots') THEN
                             INSERT INTO wm."IgnoredLots" ("ProductId", "LotId")
                             SELECT "ProductId", "LotId"
                             FROM "IgnoredLots";
                         END IF;
                     END $$;
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ClientErrors",
                schema: "wm");

            migrationBuilder.DropTable(
                name: "IgnoredLots",
                schema: "wm");
        }
    }
}
