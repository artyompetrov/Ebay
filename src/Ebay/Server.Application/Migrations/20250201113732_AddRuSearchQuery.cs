using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations;

/// <inheritdoc />
public partial class AddRuSearchQuery : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.CreateTable(
            name: "RuSearchQueries",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Query = table.Column<string>(type: "text", nullable: false),
                ProductId = table.Column<Guid>(type: "uuid", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_RuSearchQueries", x => x.Id);
                _ = table.ForeignKey(
                    name: "FK_RuSearchQueries_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateIndex(
            name: "IX_RuSearchQueries_ProductId",
            table: "RuSearchQueries",
            column: "ProductId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropTable(
            name: "RuSearchQueries");
    }
}
