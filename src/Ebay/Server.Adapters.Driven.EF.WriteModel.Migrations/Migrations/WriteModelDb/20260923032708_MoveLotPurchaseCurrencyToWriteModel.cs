using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveLotPurchaseCurrencyToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:hstore", ",,");

            migrationBuilder.CreateTable(
                name: "Currencies",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<string>(type: "text", nullable: false),
                    CurrencyRusName = table.Column<string>(type: "text", nullable: false),
                    CurrencyApiName = table.Column<string>(type: "text", nullable: false),
                    CurrencyRate = table.Column<double>(type: "double precision", nullable: false),
                    LastUpdate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currencies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Lots",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Pcs = table.Column<int>(type: "integer", nullable: false),
                    LotSize = table.Column<int>(type: "integer", nullable: true),
                    CurrencyId = table.Column<string>(type: "text", nullable: false),
                    ShippingCountry = table.Column<string>(type: "text", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: false),
                    Shipping = table.Column<double>(type: "double precision", nullable: false),
                    ShippingAdditional = table.Column<double>(type: "double precision", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    ShortDescription = table.Column<string>(type: "text", nullable: true),
                    Condition = table.Column<string>(type: "text", nullable: false),
                    ConditionDescription = table.Column<string>(type: "text", nullable: true),
                    Seller = table.Column<string>(type: "text", nullable: false),
                    LocatedIn = table.Column<string>(type: "text", nullable: false),
                    TitleChangeDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdateDate = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Categories = table.Column<Dictionary<string, string>>(type: "hstore", nullable: false),
                    LotCalculationResult = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lots", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lots_Currencies_CurrencyId",
                        column: x => x.CurrencyId,
                        principalSchema: "wm",
                        principalTable: "Currencies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Lots_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "wm",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Lot_Purchases",
                schema: "wm",
                columns: table => new
                {
                    Date = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    LotId = table.Column<long>(type: "bigint", nullable: false),
                    Price = table.Column<double>(type: "double precision", nullable: true),
                    Quantity = table.Column<int>(type: "integer", nullable: false),
                    PurchaseCalculationResult = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lot_Purchases", x => new { x.LotId, x.Date });
                    table.ForeignKey(
                        name: "FK_Lot_Purchases_Lots_LotId",
                        column: x => x.LotId,
                        principalSchema: "wm",
                        principalTable: "Lots",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lots_CurrencyId",
                schema: "wm",
                table: "Lots",
                column: "CurrencyId");

            migrationBuilder.CreateIndex(
                name: "IX_Lots_ProductId",
                schema: "wm",
                table: "Lots",
                column: "ProductId");

            // Currencies/Lots не ведут своих CreatedAt/ChangedAt в legacy-схеме - берём ближайшую по смыслу
            // существующую дату (LastUpdate/UpdateDate) вместо now(), чтобы не терять историчность при переносе.
            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."Currencies"
                         ("Id", "CurrencyRusName", "CurrencyApiName", "CurrencyRate", "LastUpdate", "CreatedAt", "ChangedAt")
                     SELECT
                         "CurrencyEbayName", "CurrencyRusName", "CurrencyApiName", "CurrencyRate", "LastUpdate", "LastUpdate", "LastUpdate"
                     FROM "Currencies";
                     """);

            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."Lots"
                         ("Id", "ProductId", "Name", "Pcs", "LotSize", "CurrencyId", "ShippingCountry", "Price", "Shipping",
                          "ShippingAdditional", "Description", "ShortDescription", "Condition", "ConditionDescription",
                          "Seller", "LocatedIn", "TitleChangeDate", "UpdateDate", "Categories", "LotCalculationResult",
                          "CreatedAt", "ChangedAt")
                     SELECT
                         "Id", "ProductId", "Name", "Pcs", "LotSize", "CurrencyId", "ShippingCountry", "Price", "Shipping",
                         "ShippingAdditional", "Description", "ShortDescription", "Condition", "ConditionDescription",
                         "Seller", "LocatedIn", "TitleChangeDate", "UpdateDate", "Categories", "LotCalculationResult",
                         "UpdateDate", "UpdateDate"
                     FROM "Lots";
                     """);

            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."Lot_Purchases"
                         ("LotId", "Date", "Price", "Quantity", "PurchaseCalculationResult")
                     SELECT
                         "LotId", "Date", "Price", "Quantity", "PurchaseCalculationResult"
                     FROM "Purchases";
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lot_Purchases",
                schema: "wm");

            migrationBuilder.DropTable(
                name: "Lots",
                schema: "wm");

            migrationBuilder.DropTable(
                name: "Currencies",
                schema: "wm");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:hstore", ",,");
        }
    }
}
