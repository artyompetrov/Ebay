using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    public partial class ConditionDescription : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ConditionDescription",
                table: "Lots",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "ConditionDescription",
                table: "Lots",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }
    }
}
