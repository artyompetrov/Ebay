using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class AddProductIdToLotForSales : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                schema: "wm",
                table: "LotForSales",
                type: "uuid",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProductId",
                schema: "wm",
                table: "LotForSales");
        }
    }
}
