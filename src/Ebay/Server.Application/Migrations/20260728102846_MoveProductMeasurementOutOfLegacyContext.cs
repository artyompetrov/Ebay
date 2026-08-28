using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class MoveProductMeasurementOutOfLegacyContext : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ProductMeasurements физически переносится в схему wm миграцией
            // MoveProductMeasurementToWriteModel в Server.Adapters.Driven.EF.WriteModel.Migrations.
            // Здесь фиксируется только то, что ApplicationDbContext больше не владеет этой таблицей
            // и не объявляет FK на неё - существующие в БД констрейнты (в т.ч. FK на MatchedPairDifferences)
            // не трогаются и продолжают действовать после переноса.
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
