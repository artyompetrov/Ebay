using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddSaleLotAggregate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "LotId",
                table: "ProductMeasurements",
                type: "character varying(7)",
                maxLength: 7,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(100)",
                oldMaxLength: 100,
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "SaleLots",
                columns: table => new
                {
                    Id = table.Column<string>(type: "character varying(7)", maxLength: 7, nullable: false),
                    Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ChangedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    xmin = table.Column<uint>(type: "xid", rowVersion: true, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SaleLots", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_ProductMeasurements_SaleLots_LotId",
                table: "ProductMeasurements",
                column: "LotId",
                principalTable: "SaleLots",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductMeasurements_SaleLots_LotId",
                table: "ProductMeasurements");

            migrationBuilder.DropTable(
                name: "SaleLots");

            migrationBuilder.AlterColumn<string>(
                name: "LotId",
                table: "ProductMeasurements",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true,
                oldClrType: typeof(string),
                oldType: "character varying(7)",
                oldMaxLength: 7,
                oldNullable: true);
        }
    }
}
