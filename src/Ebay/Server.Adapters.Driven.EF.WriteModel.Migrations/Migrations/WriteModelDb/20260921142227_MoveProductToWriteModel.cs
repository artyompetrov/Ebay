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

            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."Products"
                         ("Id", "Name", "LastCheckTime", "Weight", "ProductCalculationResult", "CreatedAt", "ChangedAt")
                     SELECT
                         "Id", "Name", "LastCheckTime", "Weight", "ProductCalculationResult", "CreatedAt", "ChangedAt"
                     FROM "Products";
                     """);

            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."Product_SearchQueries"
                         ("Id", "Query", "ProductId", "CreatedAt", "ChangedAt")
                     SELECT
                         "Id", "Query", "ProductId", "CreatedAt", "ChangedAt"
                     FROM "Product_SearchQueries";
                     """);

            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."Product_RuSearchQueries"
                         ("Id", "Query", "ProductId", "CreatedAt", "ChangedAt")
                     SELECT
                         "Id", "Query", "ProductId", "CreatedAt", "ChangedAt"
                     FROM "Product_RuSearchQueries";
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
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
