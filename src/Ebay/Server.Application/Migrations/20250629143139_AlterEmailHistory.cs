using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Application.Migrations;

/// <inheritdoc />
public partial class AlterEmailHistory : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.RenameColumn(
            name: "EmailId",
            table: "EmailSendHistories",
            newName: "ProductKey");

        _ = migrationBuilder.RenameIndex(
            name: "IX_EmailSendHistories_EmailId",
            table: "EmailSendHistories",
            newName: "IX_EmailSendHistories_ProductKey");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.RenameColumn(
            name: "ProductKey",
            table: "EmailSendHistories",
            newName: "EmailId");

        _ = migrationBuilder.RenameIndex(
            name: "IX_EmailSendHistories_ProductKey",
            table: "EmailSendHistories",
            newName: "IX_EmailSendHistories_EmailId");
    }
}
