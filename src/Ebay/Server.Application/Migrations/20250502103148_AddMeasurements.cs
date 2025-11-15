using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations
{
    /// <inheritdoc />
    public partial class AddMeasurements : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.CreateTable(
                name: "ProductMeasurements",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                    Measurements = table.Column<byte[]>(type: "bytea", nullable: false)
                },
                constraints: table =>
                {
                    _ = table.PrimaryKey("PK_ProductMeasurements", x => x.Id);
                    _ = table.ForeignKey(
                        name: "FK_ProductMeasurements_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            _ = migrationBuilder.CreateIndex(
                name: "IX_ProductMeasurements_ProductId",
                table: "ProductMeasurements",
                column: "ProductId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropTable(
                name: "ProductMeasurements");
        }
    }
}