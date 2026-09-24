using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveProductEmailSendHistoryToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductEmailSendHistories",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Seller = table.Column<string>(type: "text", nullable: false),
                    Link = table.Column<string>(type: "text", nullable: false),
                    Marketplace = table.Column<string>(type: "text", nullable: false),
                    IsAmbiguous = table.Column<bool>(type: "boolean", nullable: false),
                    AdvertisementDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Contact = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductEmailSendHistories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductEmailSendHistories_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "wm",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistories_AdvertisementDate",
                schema: "wm",
                table: "ProductEmailSendHistories",
                column: "AdvertisementDate");

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistories_ProductId",
                schema: "wm",
                table: "ProductEmailSendHistories",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductEmailSendHistories_ProductId_Seller_Marketplace",
                schema: "wm",
                table: "ProductEmailSendHistories",
                columns: new[] { "ProductId", "Seller", "Marketplace" },
                unique: true);

            // Legacy "SaleAdvertisements" использовала int identity Id и не вела CreatedAt/ChangedAt отдельно
            // от бизнес-даты объявления - как и для Lots/Currencies, генерируем новый Id и используем
            // ближайшую по смыслу существующую дату (дату объявления) вместо now() для аудит-полей.
            // Guarded by a legacy-table existence check: no-op on a database bootstrapping this migration for
            // the first time (per task 7.6's removal of the legacy migration history that used to create this
            // table); harmless replay of an already-applied data copy otherwise.
            migrationBuilder.Sql(
                sql: """
                     DO $$
                     BEGIN
                         IF EXISTS (
                             SELECT 1 FROM information_schema.tables
                             WHERE table_schema = 'public' AND table_name = 'SaleAdvertisements') THEN
                             INSERT INTO wm."ProductEmailSendHistories"
                                 ("Id", "ProductId", "Seller", "Link", "Marketplace", "IsAmbiguous", "AdvertisementDate", "Contact", "CreatedAt", "ChangedAt")
                             SELECT
                                 gen_random_uuid(), "ProductId", "Seller", "Link", "Marketplace", "IsAmbiguous", "CreatedAt", "Contact", "CreatedAt", "CreatedAt"
                             FROM "SaleAdvertisements";
                         END IF;
                     END $$;
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductEmailSendHistories",
                schema: "wm");
        }
    }
}
