using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveProductPassportToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ProductPassports",
                schema: "wm",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    FileName = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    ContentType = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Content = table.Column<byte[]>(type: "bytea", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductPassports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductPassports_Products_ProductId",
                        column: x => x.ProductId,
                        principalSchema: "wm",
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ProductPassports_ProductId_Order",
                schema: "wm",
                table: "ProductPassports",
                columns: new[] { "ProductId", "Order" });

            // Legacy "ProductPassports" has no separate CreatedAt/ChangedAt - same backfill-from-nearest-date
            // approach as every other legacy-to-wm move; there is no better source date here than now(), since
            // passports (unlike Lots/Currencies) never carried any date field at all.
            migrationBuilder.Sql(
                sql: """
                     INSERT INTO wm."ProductPassports"
                         ("Id", "ProductId", "FileName", "ContentType", "Order", "Content", "CreatedAt", "ChangedAt")
                     SELECT
                         "Id", "ProductId", "FileName", "ContentType", "Order", "Content", now(), now()
                     FROM "ProductPassports";
                     """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductPassports",
                schema: "wm");
        }
    }
}
