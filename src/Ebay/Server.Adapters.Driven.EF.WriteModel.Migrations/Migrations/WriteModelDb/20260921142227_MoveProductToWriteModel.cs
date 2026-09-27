using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveProductToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Products",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    LastCheckTime = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Weight = table.Column<int>(type: "integer", nullable: false),
                    ProductCalculationResult = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Product_RuSearchQueries",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Query = table.Column<string>(type: "text", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product_RuSearchQueries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_RuSearchQueries_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "wm",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Product_SearchQueries",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Query = table.Column<string>(type: "text", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Product_SearchQueries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Product_SearchQueries_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "wm",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Product_RuSearchQueries_ProductId",
                schema: "wm",
                table: "Product_RuSearchQueries",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_Product_SearchQueries_ProductId",
                schema: "wm",
                table: "Product_SearchQueries",
                column: "ProductId");

            // Guarded by legacy-table existence checks: no-op on a database bootstrapping this migration for
            // the first time (i.e. one that never had these legacy tables, per task 7.6's removal of the
            // legacy migration history that used to create them); harmless replay of already-applied data
            // copies otherwise, since EF tracks applied migrations by name, not by re-checksumming the file.
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'Products') THEN
                             INSERT INTO wm."Products"
                                 ("Id", "Name", "LastCheckTime", "Weight", "ProductCalculationResult", "CreatedAt", "ChangedAt")
                             SELECT
                                 "Id", "Name", "LastCheckTime", "Weight", "ProductCalculationResult", "CreatedAt", "ChangedAt"
                             FROM "Products";
                         END IF;
                     END $$;
                     """);

            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'Product_SearchQueries') THEN
                             INSERT INTO wm."Product_SearchQueries"
                                 ("Id", "Query", "ProductId", "CreatedAt", "ChangedAt")
                             SELECT
                                 "Id", "Query", "ProductId", "CreatedAt", "ChangedAt"
                             FROM "Product_SearchQueries";
                         END IF;
                     END $$;
                     """);

            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'Product_RuSearchQueries') THEN
                             INSERT INTO wm."Product_RuSearchQueries"
                                 ("Id", "Query", "ProductId", "CreatedAt", "ChangedAt")
                             SELECT
                                 "Id", "Query", "ProductId", "CreatedAt", "ChangedAt"
                             FROM "Product_RuSearchQueries";
                         END IF;
                     END $$;
                     """);

            // ProductMeasurements/TubeWorkingPoints уже ссылались на legacy "Products" (добавлено в
            // MoveMeasurementAggregatesToWriteModel в расчёте на этот перенос) - теперь, когда у Product
            // появился wm-аналог и legacy-таблица перестаёт пополняться, перевешиваем оба FK на него.
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1
                             FROM pg_constraint
                             WHERE conname = 'FK_ProductMeasurements_Products_ProductId'
                               AND conrelid = 'wm."ProductMeasurements"'::regclass) THEN
                             ALTER TABLE wm."ProductMeasurements"
                             DROP CONSTRAINT "FK_ProductMeasurements_Products_ProductId";
                         END IF;

                         ALTER TABLE wm."ProductMeasurements"
                         ADD CONSTRAINT "FK_ProductMeasurements_Products_ProductId"
                         FOREIGN KEY ("ProductId")
                         REFERENCES wm."Products"("Id")
                         ON DELETE RESTRICT;

                         IF EXISTS (
                             SELECT 1
                             FROM pg_constraint
                             WHERE conname = 'FK_TubeWorkingPoints_Products_Id'
                               AND conrelid = 'wm."TubeWorkingPoints"'::regclass) THEN
                             ALTER TABLE wm."TubeWorkingPoints"
                             DROP CONSTRAINT "FK_TubeWorkingPoints_Products_Id";
                         END IF;

                         ALTER TABLE wm."TubeWorkingPoints"
                         ADD CONSTRAINT "FK_TubeWorkingPoints_Products_Id"
                         FOREIGN KEY ("Id")
                         REFERENCES wm."Products"("Id")
                         ON DELETE RESTRICT;
                     END $$;
                     """);

            // DropLegacyProductForeignKeysAfterProductMove (legacy migration, runs first per Program.cs's
            // migration order) already dropped the old FK_Lots_Products_ProductId/FK_IgnoredLots_..._ProductId/
            // FK_ProductPassports_..._ProductId/FK_SaleAdvertisements_..._ProductId (they pointed at the legacy
            // "Products" table, which stops being written to once Product is cut over). Re-add them here,
            // pointing at wm."Products", so these still-legacy tables keep referential integrity against the
            // table that now actually owns Product; RESTRICT (not the original CASCADE) per AGENTS.md's rule
            // that cross-aggregate FKs use RESTRICT, not CASCADE. Each is individually guarded by its own
            // legacy-table existence check: on a database bootstrapping this migration for the first time (per
            // task 7.6's removal of the legacy migration history), none of these legacy tables exist at all -
            // each one gets its own wm-schema equivalent (with its own FK to wm."Products") from its own later
            // "Move X to WriteModel" migration instead, so there is nothing here to add yet.
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'Lots') THEN
                             IF NOT EXISTS (
                                 SELECT 1
                                 FROM pg_constraint
                                 WHERE conname = 'FK_Lots_Products_ProductId'
                                   AND conrelid = '"Lots"'::regclass) THEN
                                 ALTER TABLE "Lots"
                                 ADD CONSTRAINT "FK_Lots_Products_ProductId"
                                 FOREIGN KEY ("ProductId")
                                 REFERENCES wm."Products"("Id")
                                 ON DELETE RESTRICT;
                             END IF;
                         END IF;

                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'IgnoredLots') THEN
                             IF NOT EXISTS (
                                 SELECT 1
                                 FROM pg_constraint
                                 WHERE conname = 'FK_IgnoredLots_Products_ProductId'
                                   AND conrelid = '"IgnoredLots"'::regclass) THEN
                                 ALTER TABLE "IgnoredLots"
                                 ADD CONSTRAINT "FK_IgnoredLots_Products_ProductId"
                                 FOREIGN KEY ("ProductId")
                                 REFERENCES wm."Products"("Id")
                                 ON DELETE RESTRICT;
                             END IF;
                         END IF;

                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'ProductPassports') THEN
                             IF NOT EXISTS (
                                 SELECT 1
                                 FROM pg_constraint
                                 WHERE conname = 'FK_ProductPassports_Products_ProductId'
                                   AND conrelid = '"ProductPassports"'::regclass) THEN
                                 ALTER TABLE "ProductPassports"
                                 ADD CONSTRAINT "FK_ProductPassports_Products_ProductId"
                                 FOREIGN KEY ("ProductId")
                                 REFERENCES wm."Products"("Id")
                                 ON DELETE RESTRICT;
                             END IF;
                         END IF;

                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'SaleAdvertisements') THEN
                             IF NOT EXISTS (
                                 SELECT 1
                                 FROM pg_constraint
                                 WHERE conname = 'FK_SaleAdvertisements_Products_ProductId'
                                   AND conrelid = '"SaleAdvertisements"'::regclass) THEN
                                 ALTER TABLE "SaleAdvertisements"
                                 ADD CONSTRAINT "FK_SaleAdvertisements_Products_ProductId"
                                 FOREIGN KEY ("ProductId")
                                 REFERENCES wm."Products"("Id")
                                 ON DELETE RESTRICT;
                             END IF;
                         END IF;
                     END $$;
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Drop the FKs this migration pointed at wm."Products" before dropping that table below;
            // DropLegacyProductForeignKeysAfterProductMove.Down() re-adds them against the legacy "Products"
            // table once it is rolled back in turn.
            migrationBuilder.Sql(
                sql: """
                     ALTER TABLE "Lots" DROP CONSTRAINT "FK_Lots_Products_ProductId";
                     ALTER TABLE "IgnoredLots" DROP CONSTRAINT "FK_IgnoredLots_Products_ProductId";
                     ALTER TABLE "ProductPassports" DROP CONSTRAINT "FK_ProductPassports_Products_ProductId";
                     ALTER TABLE "SaleAdvertisements" DROP CONSTRAINT "FK_SaleAdvertisements_Products_ProductId";
                     """);

            migrationBuilder.Sql(
                sql: """
                     ALTER TABLE wm."ProductMeasurements"
                     DROP CONSTRAINT "FK_ProductMeasurements_Products_ProductId";

                     ALTER TABLE wm."ProductMeasurements"
                     ADD CONSTRAINT "FK_ProductMeasurements_Products_ProductId"
                     FOREIGN KEY ("ProductId")
                     REFERENCES "Products"("Id")
                     ON DELETE RESTRICT;

                     ALTER TABLE wm."TubeWorkingPoints"
                     DROP CONSTRAINT "FK_TubeWorkingPoints_Products_Id";

                     ALTER TABLE wm."TubeWorkingPoints"
                     ADD CONSTRAINT "FK_TubeWorkingPoints_Products_Id"
                     FOREIGN KEY ("Id")
                     REFERENCES "Products"("Id")
                     ON DELETE RESTRICT;
                     """);

            migrationBuilder.DropTable(
                name: "Product_RuSearchQueries",
                schema: "wm");

            migrationBuilder.DropTable(
                name: "Product_SearchQueries",
                schema: "wm");

            migrationBuilder.DropTable(
                name: "Products",
                schema: "wm");
        }
    }
}
