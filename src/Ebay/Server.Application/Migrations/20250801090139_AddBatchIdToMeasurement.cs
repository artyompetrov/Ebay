using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddBatchIdToMeasurement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BatchId",
                table: "ProductMeasurements",
                type: "character varying(100)",
                maxLength: 100,
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "ProductMeasurements");
        }
    }
}
