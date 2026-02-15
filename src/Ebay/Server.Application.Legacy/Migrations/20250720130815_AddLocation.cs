using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AddLocation : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AddColumn<string>(
            name: "Location",
            table: "ProductMeasurements",
            type: "character varying(200)",
            maxLength: 200,
            nullable: true);
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropColumn(
            name: "Location",
            table: "ProductMeasurements");
    }
}