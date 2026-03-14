# AGENTS.md for src/Ebay

Этот файл содержит правила для C# backend и Blazor frontend в `src/Ebay`.

## Code style
- Для сериализации JSON в C# новых контрактов/клиентов предпочитаем `System.Text.Json` и постепенно уходим от `Newtonsoft.Json`.
- В домене и application-слое стараемся не завязываться на статические методы там, где важна тестируемость: предпочитаем передавать зависимости через интерфейсы/абстракции и параметры конструктора.
- Для `Server.Application.New` обязательно документируйте все `public` объекты и их `public` члены через XML-комментарии (`///`), иначе сборка может падать из-за генерации документации.

## Настройки сборки
- Файл `src/Ebay/Directory.Build.props` включает проверки на nullable reference types, implicit usings и рассматривает предупреждения как ошибки. Убедитесь, что проекты .NET собираются без предупреждений.

## Структура проектов внутри src/Ebay
- `/Frontend`: фронтенд на Blazor WebAssembly.
- `/Server`: backend host (точка входа API и composition root).
- `/Server.Client`: сгенерированный/вспомогательный клиент для API.
- `/Server.Adapters.Driven.*`: реализации driven-адаптеров (EF, SMTP, внешние интеграции и т.д.).
- `/Server.Adapters.Driving.WebApi`: driving-адаптер WebApi.
- `/Server.Application`: legacy application-слой.
- `/Server.Application.New`: новый чистый application-слой.
- `/Server.Application.Abstractions.*`: контракты driving/driven портов.
- `/Server.Contracts`: OpenAPI-контракты.
- `/Tests.Unit`: unit-тесты.
- `/Tests.Integration`: интеграционные тесты.
- `/Tests.Explicit`: явно запускаемые сценарные/проверочные тесты.

## Как работает кодогенерация
- `/src/Ebay/Server.Contracts/Legacy/Ebay.yaml` — legacy-контракт приложения (новые изменения не добавляем).
- `/src/Ebay/Server.Contracts/WebApi/*.yaml` — новые контракты для WebApi-адаптеров.
- Кодогенерация выполняется MSBuild-таргетами NSwag автоматически во время сборки (`CoreCompile`), после чего генерируются C# Client/Controller и TypeScript client.

## Сборка
- `cd /workspace/Ebay/src/Ebay/ && dotnet build`

## Локальная отладка backend (PostgreSQL + API)
1. Запустить backend через `launchSettings.json`:
   ```bash
   dotnet run --launch-profile Server --project /workspace/Ebay/src/Ebay/Server/Server.csproj
   ```
   `appsettings.json` / `appsettings.Development.json` не использовать для локального запуска backend.

2. Проверить, что API отвечает:
   ```bash
   curl -i http://127.0.0.1:5080/chrome_extensions/auth
   curl -i http://127.0.0.1:5080/chrome_extensions/<extension>.xml
   ```

3. Полезные замечания:
- Порт Postgres: `15432`.
- Первый запуск может применять EF Core и MassTransit миграции.
- Тесты требуют доступной PostgreSQL.
- Для eventual consistency в интеграционных тестах использовать `Tests.Integration/TestHelpers.RetryUntilValidationSuccessAsync`.
- Для cookie-авторизации в Dev-режиме лучше поднимать backend и по HTTPS.
- Даже если не нужен полный стек фоновых задач, проверяйте, что приложение слушает порт.

## PR только после успешных проверок
После завершения кодирования обязательно:
1. Проверить сборку backend.
2. Выполнить тесты проекта.
3. Провести мануальное тестирование API/UI по типу задачи.

Если какая-либо из проверок не пройдена — исправить проблемы перед созданием PR.

## Миграция БД
- Legacy-миграции: `Server.Application/Migrations`.
- Инфраструктура БД должна находиться в адаптере БД, а не в `Server.Application.New`.

Для нового write-model адаптера использовать:
- контекст: `Server.Adapters.Driven.EF.WriteModel/WriteModelDbContext`
- сборку миграций: `Server.Adapters.Driven.EF.WriteModel.Migrations`
- схему БД: `wm`

Миграции генерировать через EF (не писать вручную):
- legacy:
  ```bash
  cd /workspace/Ebay/src/Ebay/ && dotnet ef migrations add NewMigrationName --project Server.Application --startup-project Server
  ```
- write-model:
  ```bash
  cd /workspace/Ebay/ && dotnet ef migrations add NewMigrationName --project src/Ebay/Server.Adapters.Driven.EF.WriteModel.Migrations/Server.Adapters.Driven.EF.WriteModel.Migrations.csproj --startup-project src/Ebay/Server/Server.csproj --context Server.Adapters.Driven.EF.WriteModel.WriteModelDbContext --output-dir Migrations/WriteModelDb
  ```

## Сборка в Docker и CI/CD
Проект собирается в Docker через GitHub CI/CD.
Если менялись параметры билда — проверьте `src/Dockerfile` и `.github/workflows/*.yaml`.

## Конфигурация и DI
- По умолчанию сервисы в DI регистрируем как `Transient`.
- `Singleton` используем только когда реально нужен один экземпляр на всё приложение, и рядом с регистрацией фиксируем обоснование.
- `Scoped` применяем только когда нужен общий контекст операции/запроса (в первую очередь EF `DbContext` и зависящие от него компоненты).
- Предпочитаем stateless-сервисы: не храним изменяемое состояние в полях сервисов без явной необходимости.
- В `Program.cs` не читаем параметры через `GetSection`/`GetRequiredSection` во время регистрации контейнера.
- Используем `AddOptions<...>().BindConfiguration("...").ValidateDataAnnotations().ValidateOnStart()`.
- `src/Ebay/Server/appsettings.json` и `appsettings.Development.json` не используем для runtime-настроек backend.
- Локальные параметры backend храним в `src/Ebay/Server/Properties/launchSettings.json`.

## DDD
- Граница агрегата = граница транзакции и консистентности.
- Ссылки между агрегатами хранить только по AggregateId.
- Навигационные свойства между агрегатами в write-model запрещены.
- Полные навигации (joins/includes) допустимы только в read-model.
- Каскадные удаления/обновления допустимы только внутри одного агрегата.
- Между агрегатами используем максимум `RESTRICT` как техническую защиту.

Агрегаты: `Server.Domain`.
Репозитории: `Server.Adapters.Driven.EF.WriteModel`.
Ридмодели: `Server.Adapters.Driven.EF.ReadModel`.
Новый application-код размещать в `Server.Application.New`.

## Hexagonal Architecture (Ports & Adapters)
- `Server.Domain` — доменные правила и инварианты.
- `Server.Application.New` — use-case'ы и порты.
- `Server.Adapters.*` — реализации портов.
- В `Server.Application.New` запрещены ссылки на `Server.Adapters.*` и инфраструктурные детали.
- `Server.Application.New` может ссылаться на `Server.Domain`.
- Composition Root по умолчанию на уровне хоста/адаптеров.

## Иконки
На UI используются иконки из коллекции https://icones.js.org/collection/oi, https://github.com/iconic/open-iconic или emoji.

## Пользовательские сценарии на сайте
- **Создание продукта:** пользователь создает товар на странице продуктов.
- **Переход к замерам:** после создания открывает `/Product/{productId}/Measurements`.
- **Создание лота для продажи:** в блоке `Лоты для продажи` вводит только название и нажимает кнопку создания.
- **Выбор лота для замера:** в таблице замеров поле `Lot ID` выбирается из выпадающего списка созданных лотов.
- `Id` лота пользователь не вводит: 7-символьный идентификатор генерируется автоматически в агрегате `LotForSale`.
