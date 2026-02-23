using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveExistingWriteEntitiesToWriteModelSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "wm");

            migrationBuilder.Sql("ALTER TABLE IF EXISTS public.\"MatchedPairDifferences\" SET SCHEMA wm;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS public.\"ProductMeasurements\" SET SCHEMA wm;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS public.\"Product_RuSearchQueries\" SET SCHEMA wm;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS public.\"Product_SearchQueries\" SET SCHEMA wm;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS public.\"Products\" SET SCHEMA wm;");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("ALTER TABLE IF EXISTS wm.\"MatchedPairDifferences\" SET SCHEMA public;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS wm.\"ProductMeasurements\" SET SCHEMA public;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS wm.\"Product_RuSearchQueries\" SET SCHEMA public;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS wm.\"Product_SearchQueries\" SET SCHEMA public;");
            migrationBuilder.Sql("ALTER TABLE IF EXISTS wm.\"Products\" SET SCHEMA public;");
        }
    }
}
