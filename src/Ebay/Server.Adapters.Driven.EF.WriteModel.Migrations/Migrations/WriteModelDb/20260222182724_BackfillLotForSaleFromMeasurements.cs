using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class BackfillLotForSaleFromMeasurements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                sql: """
                     CREATE TABLE IF NOT EXISTS wm."LotForSale_BackfillMap" (
                         "ProductId" uuid NOT NULL,
                         "OldLotId" text NOT NULL,
                         "NewLotId" character varying(7) NOT NULL,
                         CONSTRAINT "PK_LotForSale_BackfillMap" PRIMARY KEY ("ProductId", "OldLotId"),
                         CONSTRAINT "AK_LotForSale_BackfillMap_NewLotId" UNIQUE ("NewLotId")
                     );
                     """);

            migrationBuilder.Sql(
                sql: """
                     DO $$
                     DECLARE
                         base_n bigint;
                     BEGIN
                         SELECT COUNT(*) INTO base_n
                         FROM wm."LotForSales";

                         WITH src AS (
                             SELECT DISTINCT
                                 pm."ProductId" AS product_id,
                                 btrim(pm."LotId") AS old_lot_id
                             FROM "ProductMeasurements" pm
                             WHERE pm."LotId" IS NOT NULL
                               AND btrim(pm."LotId") <> ''
                         ),
                         numbered AS (
                             SELECT
                                 src.product_id,
                                 src.old_lot_id,
                                 base_n + ROW_NUMBER() OVER (ORDER BY src.product_id, src.old_lot_id) AS n
                             FROM src
                             WHERE NOT EXISTS (
                                 SELECT 1
                                 FROM wm."LotForSale_BackfillMap" m
                                 WHERE m."ProductId" = src.product_id
                                   AND m."OldLotId" = src.old_lot_id)
                         ),
                         encoded AS (
                             SELECT
                                 n.product_id,
                                 n.old_lot_id,
                                 substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_' FROM ((n.n >> 36) & 63)::int + 1 FOR 1) ||
                                 substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_' FROM ((n.n >> 30) & 63)::int + 1 FOR 1) ||
                                 substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_' FROM ((n.n >> 24) & 63)::int + 1 FOR 1) ||
                                 substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_' FROM ((n.n >> 18) & 63)::int + 1 FOR 1) ||
                                 substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_' FROM ((n.n >> 12) & 63)::int + 1 FOR 1) ||
                                 substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_' FROM ((n.n >> 6) & 63)::int + 1 FOR 1) ||
                                 substring('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_' FROM (n.n & 63)::int + 1 FOR 1) AS new_lot_id
                             FROM numbered n
                         )
                         INSERT INTO wm."LotForSale_BackfillMap" ("ProductId", "OldLotId", "NewLotId")
                         SELECT e.product_id, e.old_lot_id, e.new_lot_id
                         FROM encoded e;

                         INSERT INTO wm."LotForSales" ("Id", "Name", "ProductId", "CreatedAt", "ChangedAt")
                         SELECT
                             m."NewLotId",
                             m."OldLotId",
                             m."ProductId",
                             now() AT TIME ZONE 'utc',
                             now() AT TIME ZONE 'utc'
                         FROM wm."LotForSale_BackfillMap" m
                         WHERE NOT EXISTS (
                             SELECT 1
                             FROM wm."LotForSales" l
                             WHERE l."Id" = m."NewLotId");

                         UPDATE "ProductMeasurements" pm
                         SET "LotId" = m."NewLotId"
                         FROM wm."LotForSale_BackfillMap" m
                         WHERE pm."ProductId" = m."ProductId"
                           AND pm."LotId" IS NOT NULL
                           AND btrim(pm."LotId") = m."OldLotId";
                     END $$;
                     """);

            migrationBuilder.Sql(
                """
                DROP TABLE wm."LotForSale_BackfillMap"
                """);
            
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF NOT EXISTS (
                             SELECT 1
                             FROM pg_constraint
                             WHERE conname = 'FK_ProductMeasurements_LotForSales_LotId') THEN
                             ALTER TABLE "ProductMeasurements"
                             ADD CONSTRAINT "FK_ProductMeasurements_LotForSales_LotId"
                             FOREIGN KEY ("LotId")
                             REFERENCES wm."LotForSales"("Id")
                             ON DELETE RESTRICT;
                         END IF;
                     END $$;
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                sql: """
                     ALTER TABLE "ProductMeasurements"
                     DROP CONSTRAINT IF EXISTS "FK_ProductMeasurements_LotForSales_LotId";
                     """);
        }
    }
}
