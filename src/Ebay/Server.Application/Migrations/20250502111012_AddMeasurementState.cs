using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Migrations;

/// <inheritdoc />
public partial class AddMeasurementState : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AddColumn<int>(
            name: "State",
            table: "ProductMeasurements",
            type: "integer",
            nullable: false,
            defaultValue: 0);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropColumn(
            name: "State",
            table: "ProductMeasurements");
    }
}