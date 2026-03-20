# AGENTS.md for src/Ebay

Правила для C# backend и Blazor frontend в `src/Ebay`.

## Code style
- Перед изменениями в C#-коде изучайте не только `src/.editorconfig`, но и `src/Ebay/Directory.Build.props`.
- Для новых C#-контрактов/клиентов используем `System.Text.Json`.
- Для тестируемого кода в domain/application избегаем лишней зависимости от статических методов.
- В `Server.Application.New` документируем все `public` типы и `public` члены через XML-комментарии (`///`).
- Для даты/времени используем `DateTimeOffset` и `DateOnly`; `DateTime` не используем.
- Бизнес-правила размещаем в `Server.Domain`; адаптеры содержат только трансляцию ввода/вывода.
- Не расширяем видимость членов только ради тестов.

## Сборка и качество
- `src/Ebay/Directory.Build.props` включает строгие проверки (nullable, warnings as errors).
- Базовая проверка сборки: `cd /workspace/Ebay/src/Ebay && dotnet build`.

## Структура модулей
- `Frontend` — Blazor WebAssembly.
- `Server` — backend host (composition root).
- `Server.Contracts` — OpenAPI-контракты.
- `Server.Application` — legacy application layer.
- `Server.Application.New` — новый application layer.
- `Server.Domain` — доменная модель.
- `Server.Adapters.*` — адаптеры.
- `Tests.Unit`, `Tests.Integration`, `Tests.Explicit` — тестовые проекты.

## Кодогенерация
- Legacy-контракт: `src/Ebay/Server.Contracts/Legacy/Ebay.yaml` (новые изменения туда не добавляем).
- Новые контракты: `src/Ebay/Server.Contracts/WebApi/*.yaml`.
- NSwag-кодогенерация выполняется автоматически MSBuild-таргетами во время сборки.

## Локальная отладка backend
- Запуск: `dotnet run --launch-profile Server --project /workspace/Ebay/src/Ebay/Server/Server.csproj`.
- Для backend runtime-настроек используем `launchSettings.json`; не используем `appsettings*.json`.
- Для локальной БД используем PostgreSQL на порту `15432`; backend-тесты зависят от доступной БД.
- Для eventual consistency в интеграционных тестах используем `Tests.Integration/TestHelpers.RetryUntilValidationSuccessAsync`.
- Полезные проверки API:
  - `curl -i http://127.0.0.1:5080/chrome_extensions/auth`
  - `curl -i http://127.0.0.1:5080/chrome_extensions/<extension>.xml`

## Миграции БД
- Legacy-миграции: `Server.Application/Migrations`.
- Инфраструктура БД должна находиться в DB-адаптере, а не в `Server.Application.New`.
- Для write-model используем:
  - `WriteModelDbContext`: `Server.Adapters.Driven.EF.WriteModel/WriteModelDbContext`
  - проект миграций: `Server.Adapters.Driven.EF.WriteModel.Migrations`
  - схема БД: `wm`
- Миграции создаем только через EF CLI (не вручную).
- Команды:
  - legacy: `cd /workspace/Ebay/src/Ebay && dotnet ef migrations add NewMigrationName --project Server.Application --startup-project Server`
  - write-model: `cd /workspace/Ebay && dotnet ef migrations add NewMigrationName --project src/Ebay/Server.Adapters.Driven.EF.WriteModel.Migrations/Server.Adapters.Driven.EF.WriteModel.Migrations.csproj --startup-project src/Ebay/Server/Server.csproj --context Server.Adapters.Driven.EF.WriteModel.WriteModelDbContext --output-dir Migrations/WriteModelDb`

## Конфигурация и DI
- По умолчанию сервисы: `Transient`.
- `Scoped` — только для общего контекста операции (прежде всего EF `DbContext`).
- `Singleton` — только с явным обоснованием.
- В `Program.cs` не читаем параметры напрямую через `GetSection`/`GetRequiredSection` при регистрации контейнера.
- Используем `AddOptions<...>().BindConfiguration("...").ValidateDataAnnotations().ValidateOnStart()`.

## Архитектурные ограничения
### DDD
- Граница агрегата = граница транзакции и консистентности.
- Между агрегатами храним ссылки только по AggregateId.
- Навигационные свойства между агрегатами в write-model запрещены.
- Полные навигации (`join`/`include`) допустимы только в read-model.
- Каскадные удаления/обновления допустимы только внутри агрегата; между агрегатами используем `RESTRICT`.
- `Server.Domain` содержит агрегаты, `Server.Adapters.Driven.EF.WriteModel` — репозитории, `Server.Adapters.Driven.EF.ReadModel` — read-model.

### Hexagonal
- `Server.Domain` — доменные правила.
- `Server.Application.New` — use cases и порты.
- `Server.Adapters.*` — реализации портов.
- `Server.Application.New` не должен ссылаться на `Server.Adapters.*`.

## UI
- Иконки: Open Iconic (https://icones.js.org/collection/oi, https://github.com/iconic/open-iconic) или emoji.
