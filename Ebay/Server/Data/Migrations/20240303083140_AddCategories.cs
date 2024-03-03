using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Ebay.Server.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddCategories : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("Npgsql:PostgresExtension:hstore", ",,");

            migrationBuilder.AddColumn<Dictionary<string, string>>(
                name: "Categories",
                table: "Lots",
                type: "hstore",
                nullable: true);
            
            
            migrationBuilder.Sql(
                @"
UPDATE public.""Lots""
SET ""Categories"" = (case 
	when ""ManualCondition"" = 'newAndMatched' then hstore(array['condition','test_state'], array['new', 'matched']::text[])
	when ""ManualCondition"" = 'newAndTested' then hstore(array['condition','test_state'], array['new', 'tested']::text[])
	when ""ManualCondition"" = 'newNotTested' then hstore(array['condition','test_state'], array['new', 'notTested']::text[])
	when ""ManualCondition"" = 'dismantledAndMatched' then hstore(array['condition','test_state'], array['dismantled', 'matched']::text[])
	when ""ManualCondition"" = 'dismantledAndTested' then hstore(array['condition','test_state'], array['dismantled', 'tested']::text[])
	when ""ManualCondition"" = 'dismantledNotTested' then hstore(array['condition','test_state'], array['dismantled', 'notTested']::text[])
	when ""ManualCondition"" = 'usedAndMatched' then hstore(array['condition','test_state'], array['used', 'matched']::text[])
	when ""ManualCondition"" = 'usedAndTested' then hstore(array['condition','test_state'], array['used', 'tested']::text[])
	when ""ManualCondition"" = 'usedAndNotTested' then hstore(array['condition','test_state'], array['used', 'notTested']::text[])
	when ""ManualCondition"" = 'notWorking' then hstore(array['condition','test_state'], array['notWorking', 'notTested']::text[])
	when ""ManualCondition"" = 'notSet' then hstore(array['condition','test_state'], array['new' , 'notTested']::text[])
end)
WHERE 1=1
");
            
            migrationBuilder.DropColumn(
                name: "ManualCondition",
                table: "Lots");
            
            migrationBuilder.AlterColumn<Dictionary<string, string>>(
                name: "Categories",
                table: "Lots",
                type: "hstore",
                nullable: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Categories",
                table: "Lots");

            migrationBuilder.AlterDatabase()
                .OldAnnotation("Npgsql:PostgresExtension:hstore", ",,");

            migrationBuilder.AddColumn<string>(
                name: "ManualCondition",
                table: "Lots",
                type: "text",
                nullable: false,
                defaultValue: "");
        }
    }
}
