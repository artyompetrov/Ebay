using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Server.Data.Migrations;

/// <inheritdoc />
public partial class Initial : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.AlterDatabase()
            .Annotation("Npgsql:PostgresExtension:hstore", ",,");

        _ = migrationBuilder.CreateTable(
            name: "AspNetRoles",
            columns: table => new
            {
                Id = table.Column<string>(type: "text", nullable: false),
                Name = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                NormalizedName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_AspNetRoles", x => x.Id);
            });

        _ = migrationBuilder.CreateTable(
            name: "AspNetUsers",
            columns: table => new
            {
                Id = table.Column<string>(type: "text", nullable: false),
                UserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                NormalizedUserName = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                Email = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                NormalizedEmail = table.Column<string>(type: "character varying(256)", maxLength: 256, nullable: true),
                EmailConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                PasswordHash = table.Column<string>(type: "text", nullable: true),
                SecurityStamp = table.Column<string>(type: "text", nullable: true),
                ConcurrencyStamp = table.Column<string>(type: "text", nullable: true),
                PhoneNumber = table.Column<string>(type: "text", nullable: true),
                PhoneNumberConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                TwoFactorEnabled = table.Column<bool>(type: "boolean", nullable: false),
                LockoutEnd = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                LockoutEnabled = table.Column<bool>(type: "boolean", nullable: false),
                AccessFailedCount = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_AspNetUsers", x => x.Id);
            });

        _ = migrationBuilder.CreateTable(
            name: "ClientErrors",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Url = table.Column<string>(type: "text", nullable: false),
                ErrorText = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_ClientErrors", x => x.Id);
            });

        _ = migrationBuilder.CreateTable(
            name: "Currencies",
            columns: table => new
            {
                CurrencyEbayName = table.Column<string>(type: "text", nullable: false),
                CurrencyRusName = table.Column<string>(type: "text", nullable: false),
                CurrencyApiName = table.Column<string>(type: "text", nullable: false),
                CurrencyRate = table.Column<double>(type: "double precision", nullable: false),
                LastUpdate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_Currencies", x => x.CurrencyEbayName);
            });

        _ = migrationBuilder.CreateTable(
            name: "DeviceCodes",
            columns: table => new
            {
                UserCode = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                DeviceCode = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                SubjectId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                SessionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                ClientId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Expiration = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Data = table.Column<string>(type: "character varying(50000)", maxLength: 50000, nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_DeviceCodes", x => x.UserCode);
            });

        _ = migrationBuilder.CreateTable(
            name: "Keys",
            columns: table => new
            {
                Id = table.Column<string>(type: "text", nullable: false),
                Version = table.Column<int>(type: "integer", nullable: false),
                Created = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Use = table.Column<string>(type: "text", nullable: true),
                Algorithm = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                IsX509Certificate = table.Column<bool>(type: "boolean", nullable: false),
                DataProtected = table.Column<bool>(type: "boolean", nullable: false),
                Data = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_Keys", x => x.Id);
            });

        _ = migrationBuilder.CreateTable(
            name: "PersistedGrants",
            columns: table => new
            {
                Key = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                Type = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                SubjectId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                SessionId = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: true),
                ClientId = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                Description = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: true),
                CreationTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Expiration = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                ConsumedTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                Data = table.Column<string>(type: "character varying(50000)", maxLength: 50000, nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_PersistedGrants", x => x.Key);
            });

        _ = migrationBuilder.CreateTable(
            name: "AspNetRoleClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                RoleId = table.Column<string>(type: "text", nullable: false),
                ClaimType = table.Column<string>(type: "text", nullable: true),
                ClaimValue = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_AspNetRoleClaims", x => x.Id);
                _ = table.ForeignKey(
                    name: "FK_AspNetRoleClaims_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "AspNetUserClaims",
            columns: table => new
            {
                Id = table.Column<int>(type: "integer", nullable: false)
                    .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                UserId = table.Column<string>(type: "text", nullable: false),
                ClaimType = table.Column<string>(type: "text", nullable: true),
                ClaimValue = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_AspNetUserClaims", x => x.Id);
                _ = table.ForeignKey(
                    name: "FK_AspNetUserClaims_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "AspNetUserLogins",
            columns: table => new
            {
                LoginProvider = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                ProviderKey = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                ProviderDisplayName = table.Column<string>(type: "text", nullable: true),
                UserId = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_AspNetUserLogins", x => new { x.LoginProvider, x.ProviderKey });
                _ = table.ForeignKey(
                    name: "FK_AspNetUserLogins_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "AspNetUserRoles",
            columns: table => new
            {
                UserId = table.Column<string>(type: "text", nullable: false),
                RoleId = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_AspNetUserRoles", x => new { x.UserId, x.RoleId });
                _ = table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetRoles_RoleId",
                    column: x => x.RoleId,
                    principalTable: "AspNetRoles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
                _ = table.ForeignKey(
                    name: "FK_AspNetUserRoles_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "AspNetUserTokens",
            columns: table => new
            {
                UserId = table.Column<string>(type: "text", nullable: false),
                LoginProvider = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                Name = table.Column<string>(type: "character varying(128)", maxLength: 128, nullable: false),
                Value = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_AspNetUserTokens", x => new { x.UserId, x.LoginProvider, x.Name });
                _ = table.ForeignKey(
                    name: "FK_AspNetUserTokens_AspNetUsers_UserId",
                    column: x => x.UserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "Products",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                LastCheckTime = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Weight = table.Column<int>(type: "integer", nullable: false),
                ApplicationUserId = table.Column<string>(type: "text", nullable: true)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_Products", x => x.Id);
                _ = table.ForeignKey(
                    name: "FK_Products_AspNetUsers_ApplicationUserId",
                    column: x => x.ApplicationUserId,
                    principalTable: "AspNetUsers",
                    principalColumn: "Id");
            });

        _ = migrationBuilder.CreateTable(
            name: "IgnoredLots",
            columns: table => new
            {
                ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                LotId = table.Column<long>(type: "bigint", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_IgnoredLots", x => new { x.ProductId, x.LotId });
                _ = table.ForeignKey(
                    name: "FK_IgnoredLots_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "Lots",
            columns: table => new
            {
                Id = table.Column<long>(type: "bigint", nullable: false),
                ProductId = table.Column<Guid>(type: "uuid", nullable: false),
                Name = table.Column<string>(type: "text", nullable: false),
                Pcs = table.Column<int>(type: "integer", nullable: false),
                LotSize = table.Column<int>(type: "integer", nullable: true),
                CurrencyId = table.Column<string>(type: "text", nullable: false),
                ShippingCountry = table.Column<string>(type: "text", nullable: false),
                Price = table.Column<double>(type: "double precision", nullable: false),
                Shipping = table.Column<double>(type: "double precision", nullable: false),
                ShippingAdditional = table.Column<double>(type: "double precision", nullable: false),
                Description = table.Column<string>(type: "text", nullable: false),
                ShortDescription = table.Column<string>(type: "text", nullable: true),
                Condition = table.Column<string>(type: "text", nullable: false),
                ConditionDescription = table.Column<string>(type: "text", nullable: true),
                Seller = table.Column<string>(type: "text", nullable: false),
                LocatedIn = table.Column<string>(type: "text", nullable: false),
                TitleChangeDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                UpdateDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                Categories = table.Column<Dictionary<string, string>>(type: "hstore", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_Lots", x => x.Id);
                _ = table.ForeignKey(
                    name: "FK_Lots_Currencies_CurrencyId",
                    column: x => x.CurrencyId,
                    principalTable: "Currencies",
                    principalColumn: "CurrencyEbayName",
                    onDelete: ReferentialAction.Cascade);
                _ = table.ForeignKey(
                    name: "FK_Lots_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "SearchQueries",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                Query = table.Column<string>(type: "text", nullable: false),
                ProductId = table.Column<Guid>(type: "uuid", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_SearchQueries", x => x.Id);
                _ = table.ForeignKey(
                    name: "FK_SearchQueries_Products_ProductId",
                    column: x => x.ProductId,
                    principalTable: "Products",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateTable(
            name: "Purchases",
            columns: table => new
            {
                Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                LotId = table.Column<long>(type: "bigint", nullable: false),
                Price = table.Column<double>(type: "double precision", nullable: true),
                Quantity = table.Column<int>(type: "integer", nullable: false)
            },
            constraints: table =>
            {
                _ = table.PrimaryKey("PK_Purchases", x => new { x.LotId, x.Date });
                _ = table.ForeignKey(
                    name: "FK_Purchases_Lots_LotId",
                    column: x => x.LotId,
                    principalTable: "Lots",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade);
            });

        _ = migrationBuilder.CreateIndex(
            name: "IX_AspNetRoleClaims_RoleId",
            table: "AspNetRoleClaims",
            column: "RoleId");

        _ = migrationBuilder.CreateIndex(
            name: "RoleNameIndex",
            table: "AspNetRoles",
            column: "NormalizedName",
            unique: true);

        _ = migrationBuilder.CreateIndex(
            name: "IX_AspNetUserClaims_UserId",
            table: "AspNetUserClaims",
            column: "UserId");

        _ = migrationBuilder.CreateIndex(
            name: "IX_AspNetUserLogins_UserId",
            table: "AspNetUserLogins",
            column: "UserId");

        _ = migrationBuilder.CreateIndex(
            name: "IX_AspNetUserRoles_RoleId",
            table: "AspNetUserRoles",
            column: "RoleId");

        _ = migrationBuilder.CreateIndex(
            name: "EmailIndex",
            table: "AspNetUsers",
            column: "NormalizedEmail");

        _ = migrationBuilder.CreateIndex(
            name: "UserNameIndex",
            table: "AspNetUsers",
            column: "NormalizedUserName",
            unique: true);

        _ = migrationBuilder.CreateIndex(
            name: "IX_DeviceCodes_DeviceCode",
            table: "DeviceCodes",
            column: "DeviceCode",
            unique: true);

        _ = migrationBuilder.CreateIndex(
            name: "IX_DeviceCodes_Expiration",
            table: "DeviceCodes",
            column: "Expiration");

        _ = migrationBuilder.CreateIndex(
            name: "IX_Keys_Use",
            table: "Keys",
            column: "Use");

        _ = migrationBuilder.CreateIndex(
            name: "IX_Lots_CurrencyId",
            table: "Lots",
            column: "CurrencyId");

        _ = migrationBuilder.CreateIndex(
            name: "IX_Lots_ProductId",
            table: "Lots",
            column: "ProductId");

        _ = migrationBuilder.CreateIndex(
            name: "IX_PersistedGrants_ConsumedTime",
            table: "PersistedGrants",
            column: "ConsumedTime");

        _ = migrationBuilder.CreateIndex(
            name: "IX_PersistedGrants_Expiration",
            table: "PersistedGrants",
            column: "Expiration");

        _ = migrationBuilder.CreateIndex(
            name: "IX_PersistedGrants_SubjectId_ClientId_Type",
            table: "PersistedGrants",
            columns: ["SubjectId", "ClientId", "Type"]);

        _ = migrationBuilder.CreateIndex(
            name: "IX_PersistedGrants_SubjectId_SessionId_Type",
            table: "PersistedGrants",
            columns: ["SubjectId", "SessionId", "Type"]);

        _ = migrationBuilder.CreateIndex(
            name: "IX_Products_ApplicationUserId",
            table: "Products",
            column: "ApplicationUserId");

        _ = migrationBuilder.CreateIndex(
            name: "IX_SearchQueries_ProductId",
            table: "SearchQueries",
            column: "ProductId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        _ = migrationBuilder.DropTable(
            name: "AspNetRoleClaims");

        _ = migrationBuilder.DropTable(
            name: "AspNetUserClaims");

        _ = migrationBuilder.DropTable(
            name: "AspNetUserLogins");

        _ = migrationBuilder.DropTable(
            name: "AspNetUserRoles");

        _ = migrationBuilder.DropTable(
            name: "AspNetUserTokens");

        _ = migrationBuilder.DropTable(
            name: "ClientErrors");

        _ = migrationBuilder.DropTable(
            name: "DeviceCodes");

        _ = migrationBuilder.DropTable(
            name: "IgnoredLots");

        _ = migrationBuilder.DropTable(
            name: "Keys");

        _ = migrationBuilder.DropTable(
            name: "PersistedGrants");

        _ = migrationBuilder.DropTable(
            name: "Purchases");

        _ = migrationBuilder.DropTable(
            name: "SearchQueries");

        _ = migrationBuilder.DropTable(
            name: "AspNetRoles");

        _ = migrationBuilder.DropTable(
            name: "Lots");

        _ = migrationBuilder.DropTable(
            name: "Currencies");

        _ = migrationBuilder.DropTable(
            name: "Products");

        _ = migrationBuilder.DropTable(
            name: "AspNetUsers");
    }
}
