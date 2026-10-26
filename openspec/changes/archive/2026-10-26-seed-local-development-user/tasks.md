## 1. Seeding

- [x] 1.1 Add `DevelopmentUserOptions` and the `DevelopmentUserSeeder` hosted service to `Server.Adapters.Driven.EF.Identity` and register them in `AddEfIdentityAdapter`
- [x] 1.2 Set `DevelopmentUser__Email`/`DevelopmentUser__Password` in `Server/Properties/launchSettings.json`

## 2. Tests and docs

- [x] 2.1 Cover every scenario of the `user-accounts` delta with integration tests against empty scratch databases
- [x] 2.2 Describe the local sign-in user in `src/Ebay/AGENTS.md`
- [x] 2.3 Run the app locally and create a product through the UI as the seeded user
