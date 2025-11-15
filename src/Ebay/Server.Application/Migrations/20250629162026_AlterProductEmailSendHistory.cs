using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations
{
    /// <inheritdoc />
    public partial class AlterProductEmailSendHistory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_EmailSendHistories",
                table: "EmailSendHistories");

            _ = migrationBuilder.RenameTable(
                name: "EmailSendHistories",
                newName: "ProductEmailSendHistory");

            _ = migrationBuilder.RenameIndex(
                name: "IX_EmailSendHistories_ProductKey",
                table: "ProductEmailSendHistory",
                newName: "IX_ProductEmailSendHistory_ProductKey");

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_ProductEmailSendHistory",
                table: "ProductEmailSendHistory",
                column: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            _ = migrationBuilder.DropPrimaryKey(
                name: "PK_ProductEmailSendHistory",
                table: "ProductEmailSendHistory");

            _ = migrationBuilder.RenameTable(
                name: "ProductEmailSendHistory",
                newName: "EmailSendHistories");

            _ = migrationBuilder.RenameIndex(
                name: "IX_ProductEmailSendHistory_ProductKey",
                table: "EmailSendHistories",
                newName: "IX_EmailSendHistories_ProductKey");

            _ = migrationBuilder.AddPrimaryKey(
                name: "PK_EmailSendHistories",
                table: "EmailSendHistories",
                column: "Id");
        }
    }
}