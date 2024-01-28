using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMultipleSearches : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SearchQueries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Query = table.Column<string>(type: "text", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SearchQueries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SearchQueries_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_SearchQueries_ProductId",
                table: "SearchQueries",
                column: "ProductId");
            
            migrationBuilder.Sql(
                @"
INSERT INTO public.""SearchQuery""(""Id"", ""Query"", ""ProductId"")
SELECT p.""Id"", p.""SearchQuery"", p.""Id"" FROM public.""Products"" p;
"
            );
            
            migrationBuilder.DropColumn(
                name: "SearchQuery",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SearchQueries");

            migrationBuilder.AddColumn<string>(
                name: "SearchQuery",
                table: "Products",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
