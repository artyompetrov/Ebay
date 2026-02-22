INSERT INTO "AspNetUsers"
(
    "Id",
    "UserName",
    "NormalizedUserName",
    "Email",
    "NormalizedEmail",
    "EmailConfirmed",
    "PasswordHash",
    "SecurityStamp",
    "ConcurrencyStamp",
    "PhoneNumberConfirmed",
    "TwoFactorEnabled",
    "LockoutEnabled",
    "AccessFailedCount"
)
VALUES
(
    '70818b95-946e-485b-a824-41ff3227cd1c',
    'agent_test@example.com',
    'AGENT_TEST@EXAMPLE.COM',
    'agent_test@example.com',
    'AGENT_TEST@EXAMPLE.COM',
    TRUE,
    'AQAAAAIAAYagAAAAEK+yk2ZVcvAGqNGUbLcBQ4rR2FVJ4zmCdP15hkvx+lK07TwkDcTYqiOC9CtGpIpM0g==',
    'MC6TFKDDGRVOA7J2JFUA4B3AWHFIOV7U',
    'c3359bf4-43e1-4aeb-b196-fe1cb55e86c9',
    FALSE,
    FALSE,
    TRUE,
    0
)
ON CONFLICT ("Id") DO UPDATE
SET
    "EmailConfirmed" = EXCLUDED."EmailConfirmed",
    "PasswordHash" = EXCLUDED."PasswordHash",
    "SecurityStamp" = EXCLUDED."SecurityStamp",
    "ConcurrencyStamp" = EXCLUDED."ConcurrencyStamp";
