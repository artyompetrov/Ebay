using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveMeasurementAggregatesToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductMeasurements",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    MeasurementState = table.Column<int>(type: "integer", nullable: false),
                    Measurements = table.Column<byte[]>(type: "bytea", nullable: false),
                    HashAnodeCurves = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ManufactureCode = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    ProductState = table.Column<int>(type: "integer", nullable: false),
                    Location = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                    MatchId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LotId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                    LastTimeWatchedOnEbay = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductMeasurements", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductMeasurements_LotForSales_LotId",
                        column: x => x.LotId,
                        principalSchema: "wm",
                        principalTable: "LotForSales",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "TubeWorkingPoints",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    AnodeVoltage = table.Column<double>(type: "double precision", nullable: false),
                    GridVoltage = table.Column<double>(type: "double precision", nullable: false),
                    AnodeVoltageHalfWidth = table.Column<double>(type: "double precision", nullable: false),
                    GridVoltageHalfWidth = table.Column<double>(type: "double precision", nullable: false),
                    NominalCurrent = table.Column<double>(type: "double precision", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TubeWorkingPoints", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "MatchedPairDifferences",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    ComparisonMode = table.Column<int>(type: "integer", nullable: false),
                    Measurement1Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Measurement2Id = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MseSection1 = table.Column<double>(type: "double precision", nullable: false),
                    MseSection2 = table.Column<double>(type: "double precision", nullable: true),
                    RmseSection1 = table.Column<double>(type: "double precision", nullable: false),
                    RmseSection2 = table.Column<double>(type: "double precision", nullable: true),
                    MaxAbsSection1 = table.Column<double>(type: "double precision", nullable: false),
                    MaxAbsSection2 = table.Column<double>(type: "double precision", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MatchedPairDifferences", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement1Id",
                        column: x => x.Measurement1Id,
                        principalSchema: "wm",
                        principalTable: "ProductMeasurements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_MatchedPairDifferences_ProductMeasurements_Measurement2Id",
                        column: x => x.Measurement2Id,
                        principalSchema: "wm",
                        principalTable: "ProductMeasurements",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MatchedPairDifferences_Measurement1Id",
                schema: "wm",
                table: "MatchedPairDifferences",
                column: "Measurement1Id");

            migrationBuilder.CreateIndex(
                name: "IX_MatchedPairDifferences_Measurement2Id",
                schema: "wm",
                table: "MatchedPairDifferences",
                column: "Measurement2Id");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_CreatedAt",
                schema: "wm",
                table: "ProductMeasurements",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_HashAnodeCurves",
                schema: "wm",
                table: "ProductMeasurements",
                column: "HashAnodeCurves",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_LotId",
                schema: "wm",
                table: "ProductMeasurements",
                column: "LotId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_MatchId",
                schema: "wm",
                table: "ProductMeasurements",
                column: "MatchId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_ProductId",
                schema: "wm",
                table: "ProductMeasurements",
                column: "ProductId");

            // Guarded by legacy-table existence checks: these blocks read/write legacy tables that only the
            // (deleted, per task 7.6) legacy migration history creates. Each is a harmless no-op on a database
            // that already ran it (EF tracks applied migrations by name, not by re-checksumming the file, so
            // editing Up() here only changes behavior for a database bootstrapping this migration for the first
            // time - i.e. one that never had the legacy tables to begin with). The Products-FK block below is
            // skipped whenever "Products" doesn't exist (fresh database, so Product hasn't been legacy-created
            // at all yet); MoveProductToWriteModel (which runs later) unconditionally (re)points these same FKs
            // at wm."Products" once that table exists, regardless of whether this block ran.
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'ProductMeasurements') THEN
                             INSERT INTO wm."ProductMeasurements"
                                 ("Id", "ProductId", "MeasurementState", "Measurements", "HashAnodeCurves",
                                  "ManufactureCode", "ProductState", "Location", "MatchId", "LotId",
                                  "LastTimeWatchedOnEbay", "CreatedAt", "ChangedAt")
                             SELECT
                                 "Id", "ProductId", "MeasurementState", "Measurements", "HashAnodeCurves",
                                 "ManufactureCode", "ProductState", "Location", "MatchId", "LotId",
                                 "LastTimeWatchedOnEbay", "CreatedAt", "ChangedAt"
                             FROM "ProductMeasurements";
                         END IF;
                     END $$;
                     """);

            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'TubeWorkingPoints') THEN
                             INSERT INTO wm."TubeWorkingPoints"
                                 ("Id", "AnodeVoltage", "GridVoltage", "AnodeVoltageHalfWidth", "GridVoltageHalfWidth",
                                  "NominalCurrent", "CreatedAt", "ChangedAt")
                             SELECT
                                 "Id", "AnodeVoltage", "GridVoltage", "AnodeVoltageHalfWidth", "GridVoltageHalfWidth",
                                 "NominalCurrent", "CreatedAt", "ChangedAt"
                             FROM "TubeWorkingPoints";
                         END IF;
                     END $$;
                     """);

            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'MatchedPairDifferences') THEN
                             INSERT INTO wm."MatchedPairDifferences"
                                 ("Id", "ComparisonMode", "Measurement1Id", "Measurement2Id", "MseSection1", "MseSection2",
                                  "RmseSection1", "RmseSection2", "MaxAbsSection1", "MaxAbsSection2", "CreatedAt", "ChangedAt")
                             SELECT
                                 "Id", "ComparisonMode", "Measurement1Id", "Measurement2Id", "MseSection1", "MseSection2",
                                 "RmseSection1", "RmseSection2", "MaxAbsSection1", "MaxAbsSection2", "CreatedAt", "ChangedAt"
                             FROM "MatchedPairDifferences";
                         END IF;
                     END $$;
                     """);

            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF NOT EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'Products') THEN
                             RETURN;
                         END IF;

                         IF NOT EXISTS (
                             SELECT 1
                             FROM pg_constraint
                             WHERE conname = 'FK_ProductMeasurements_Products_ProductId'
                               AND conrelid = 'wm."ProductMeasurements"'::regclass) THEN
                             ALTER TABLE wm."ProductMeasurements"
                             ADD CONSTRAINT "FK_ProductMeasurements_Products_ProductId"
                             FOREIGN KEY ("ProductId")
                             REFERENCES "Products"("Id")
                             ON DELETE RESTRICT;
                         END IF;

                         IF NOT EXISTS (
                             SELECT 1
                             FROM pg_constraint
                             WHERE conname = 'FK_TubeWorkingPoints_Products_Id'
                               AND conrelid = 'wm."TubeWorkingPoints"'::regclass) THEN
                             ALTER TABLE wm."TubeWorkingPoints"
                             ADD CONSTRAINT "FK_TubeWorkingPoints_Products_Id"
                             FOREIGN KEY ("Id")
                             REFERENCES "Products"("Id")
                             ON DELETE RESTRICT;
                         END IF;
                     END $$;
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MatchedPairDifferences",
                schema: "wm");

            migrationBuilder.DropTable(
                name: "TubeWorkingPoints",
                schema: "wm");

            migrationBuilder.DropTable(
                name: "ProductMeasurements",
                schema: "wm");
        }
    }
}
