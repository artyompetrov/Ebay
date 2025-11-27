using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Server.Data.Migrations;

/// <inheritdoc />
public partial class AddCaseInsensitiveIndex : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.Sql(
@"
CREATE UNIQUE INDEX IF NOT EXISTS IX_Product_Name_CI
ON ""Products"" (LOWER(""Name""));
");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {

    }
}
