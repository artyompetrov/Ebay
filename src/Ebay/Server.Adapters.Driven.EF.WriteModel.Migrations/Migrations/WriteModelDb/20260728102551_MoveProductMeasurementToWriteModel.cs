using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Adapters.Driven.EF.WriteModel.Migrations.Migrations.WriteModelDb
{
    /// <inheritdoc />
    public partial class MoveProductMeasurementToWriteModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Таблица переносится из legacy public-схемы в wm вместе с данными: имена PK/индексов/FK
            // не меняются при ALTER TABLE ... SET SCHEMA, поэтому дополнительных операций не требуется.
            migrationBuilder.Sql(
                """
                ALTER TABLE "ProductMeasurements" SET SCHEMA wm;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                """
                ALTER TABLE wm."ProductMeasurements" SET SCHEMA public;
                """);
        }
    }
}
