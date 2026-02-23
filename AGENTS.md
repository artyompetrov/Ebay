# Project Agents.md Guide for OpenAI Codex

# О проекте
Мы разрабатываем приложение, помогающее анализировать стоимость товаров на ebay, для последующей их закупки на сайтах типа avito.ru chipfind.ru и других.

Приложение состоит из нескольких частей:
1. Серверная часть, которая запускается внутри docker (используется docker-compose)
2. Клиентская часть, которая представляет собой Blazor web assembly приложение.
3. Chrome extension, которая добавляется в браузер и позволяет просматривать страницы ebay, парсить их и сохранять в базу данных по api сервера.
4. В качестве БД используется Postgres - нужно учитывать ее синтаксис при написании sql запросов
5. В проекте используется кодогенерация клиентов и контроллеров из OpenAPI-контракта

# Code style
При написании кода мы следуем принципам SOLID DRY KISS, стараемся писать структурированный легко читаемый код, который будет легок в поддержке другими программистами. Если видим что где-то происходит копирование кода, то стараемся выделять функции/классы для избегания копирования.

Перед началом работы изучите `src/.editorconfig`, чтобы понимать, какие параметры форматирования и отступов должны использоваться по умолчанию.

Старайся использовать статическую типизацию, где это возможно - в TypeScript лучше не использовать any и лучше всегда указывать входные и выходные параметры у функций.

Для сериализации JSON в C# новых контрактов/клиентов предпочитаем `System.Text.Json` и постепенно уходим от `Newtonsoft.Json`.

Старайся не копировать лишний раз код - переиспользуй уже существующие методы, расширяй их при необходимости (код с кучей копипасты очень сложно будет поддерживать).

Для `Server.Application.New` обязательно документируй все `public` объекты и их `public` члены через XML-комментарии (`///`), иначе сборка может падать из-за генерации документации.

## Настройки сборки
- Файл `src/Ebay/Directory.Build.props` включает проверки на nullable reference types, implicit usings и рассматривает предупреждения как ошибки. Убедитесь, что проекты .NET собираются без предупреждений.

## Project Structure for OpenAI Codex Navigation

- `.github/workflows/build-and-tests.yaml` - основная CI/CD сборка docker-образов и деплой
- `/src`: исходный код
    - `/ChromeExtension`: Хром расширение
      - `/src/infrastructure`: общие утилиты и вспомогательные функции расширения. Добавляйте сюда переиспользуемые функции, чтобы избегать дублирования кода.
    - `/Ebay`: C# проект
      - `/Frontend`: Фронтенд на blazor webassembly
      - `/Server`: backend host (точка входа API и composition root)
      - `/Server.Client`: сгенерированный/вспомогательный клиент для API
      - `/Server.Adapters.Driven.*`: реализации driven-адаптеров (EF, SMTP, внешние интеграции и т.д.)
      - `/Server.Adapters.Driving.WebApi`: driving-адаптер WebApi
      - `/Server.Application`: legacy application-слой, в котором пока остается исторический код
      - `/Server.Application.New`: новый чистый application-слой (порты и бизнес-сценарии для поэтапной миграции)
      - `/Server.Application.Abstractions.*`: контракты driving/driven портов
      - `/Server.Contracts`: OpenAPI контракты (legacy и новые контракты для поэтапной миграции)
      - `/Tests.Unit`: unit-тесты
      - `/Tests.Integration`: интеграционные тесты
      - `/Tests.Explicit`: явно запускаемые сценарные/проверочные тесты
    - `Dockerfile` - Докер файл, который осуществляет сборку решения в единый контейнер, подлежащий развертыванию.
- `/deploy`: docker-compose обвязка для запуска проекта

# Как работает кодогенерация в этом проекте
`/src/Ebay/Server.Contracts/Legacy/Ebay.yaml` — legacy-контракт приложения (новые изменения в него не добавляем)
`/src/Ebay/Server.Contracts/WebApi/*.yaml` — новые контракты для WebApi-адаптеров
Кодогенерация осуществляется через MSBuild-таргеты NSwag и выполняется автоматически во время сборки (CoreCompile), после чего генерируются C# Client/Controller и TypeScript client.

# Билд проекта
C# - `cd /workspace/Ebay/src/Ebay/ && dotnet build`
ChromeExtension - `cd /workspace/Ebay/src/ChromeExtension/ && npm run build`

# Локальная отладка backend (PostgreSQL + API)

1. Запустить backend через `launchSettings.json` (локальные параметры и секреты задаем только там):
   - ```bash
     dotnet run --launch-profile Server --project /workspace/Ebay/src/Ebay/Server/Server.csproj
     ```
   - `appsettings.json` / `appsettings.Development.json` не используем для локального запуска backend.

2. Проверить, что API отвечает:
   - `curl -i http://127.0.0.1:5080/chrome_extensions/auth` (ожидается `200 OK`)
   - `curl -i http://127.0.0.1:5080/chrome_extensions/<extension>.xml`

3. Создать/обновить тестового пользователя SQL-скриптом (для UI-валидации):
   - ```bash
     psql "postgresql://ebay:catnip0-spoil4-untrimmed@localhost:15432/ebay" -v ON_ERROR_STOP=1 -f /workspace/Ebay/scripts/sql/create_or_update_test_user.sql
     ```
   - SQL-файл: `/workspace/Ebay/scripts/sql/create_or_update_test_user.sql`.
   - Учетные данные тестового пользователя: `agent_test@example.com` / `Agent123!`.

4. Примеры авторизации через `curl` и запросов к API с авторизацией:
   - Получить access token (client_credentials):
     ```bash
     TOKEN=$(curl -s -X POST http://127.0.0.1:5080/connect/token \
       -H 'Content-Type: application/x-www-form-urlencoded' \
       -d 'client_id=client_id&client_secret=secret&grant_type=client_credentials&scope=ServerAPI' \
       | python -c 'import sys, json; print(json.load(sys.stdin)["access_token"])')
     ```
   - Запрос к защищенному API:
     ```bash
     curl -i -H "Authorization: Bearer $TOKEN" http://127.0.0.1:5080/api/ebay/v1/products
     ```
   - Пример POST-запроса к защищенному API:
     ```bash
     curl -i -X POST http://127.0.0.1:5080/api/ebay/v1/products \
       -H "Authorization: Bearer $TOKEN" \
       -H 'Content-Type: application/json' \
       -d '{"name":"curl-test-product","weight":100,"searchQueries":[{"id":"11111111-1111-1111-1111-111111111111","query":"curl test"}],"ruSearchQueries":[]}'
     ```

5. Мануальная проверка определяется типом задачи:
   - Для UI-задач: зайти в браузер, пройти ключевой сценарий и проверить визуальный результат.
   - Для API-задач: выполнить релевантные запросы (минимум happy-path + один негативный сценарий).

6. Полезные замечания для отладки:
   - В проекте для Postgres используем порт `15432`.
   - Первый запуск может применять EF Core миграции и миграции MassTransit в БД.
   - Тесты проекта требуют наличия установленной и доступной БД (PostgreSQL).
   - Для корректной авторизации по cookie в Dev-режиме лучше поднимать backend и по HTTPS (например, `--urls "https://0.0.0.0:5443;http://0.0.0.0:5080"`) и открывать UI через `https://127.0.0.1:5443`.
   - При разработке UI-фич агенту полезно открыть приложение в браузере и визуально проверить финальный результат (клики по основным сценариям + скриншоты при заметных UI-изменениях).
   - Если не нужен полный стек фоновых задач, все равно проверяйте, что приложение поднимается и слушает порт (`Now listening on: http://0.0.0.0:5080`).

# Присылай Pull Request только если проект успешно собирается и проходит проверки
После завершения кодирования обязательно:
1. Проверить, что у тебя собираются и C#-проект, и Chrome extension.
2. Выполнить тесты проекта.
3. Провести мануальное тестирование:
   - Подергать API (проверить ключевые эндпоинты сценария).
   - Зайти в браузер и визуально проверить результат.
Если какая-либо из проверок не пройдена — нужно исправить проблемы перед созданием Pull Request.

# Актуализация AGENTS.md
Если в рамках задачи изменились правила разработки, структура проекта, процесс сборки/тестирования, кодогенерации, деплоя или другие договоренности, которые должны быть зафиксированы для следующих задач — обнови `AGENTS.md` в этом же PR.

# Миграция БД
Legacy-миграции находятся в проекте `Server.Application` в папке `Migrations`.
Инфраструктура БД должна находиться в адаптере БД, а не в `Server.Application.New`.

Для нового write-model адаптера используем:
- контекст: `Server.Adapters.Driven.EF.WriteModel/WriteModelDbContext`
- сборку миграций: `Server.Adapters.Driven.EF.WriteModel.Migrations`
- схема БД для новых write-model сущностей: `wm`

Новые EF-миграции для `WriteModelDbContext` генерируем в `Server.Adapters.Driven.EF.WriteModel.Migrations`.
Legacy-миграции продолжаем поддерживать в `Server.Application` до полного переноса.

Миграции БД не пишем вручную — генерируем миграции через Entity Framework.
Примеры запуска:
- legacy: `cd /workspace/Ebay/src/Ebay/ && dotnet ef migrations add NewMigrationName --project Server.Application --startup-project Server`
- write-model: `cd /workspace/Ebay/ && dotnet ef migrations add NewMigrationName --project src/Ebay/Server.Adapters.Driven.EF.WriteModel.Migrations/Server.Adapters.Driven.EF.WriteModel.Migrations.csproj --startup-project src/Ebay/Server/Server.csproj --context Server.Adapters.Driven.EF.WriteModel.WriteModelDbContext --output-dir Migrations/WriteModelDb`

# Сборка в docker и CI CD
Проект собирается в Docker при помощи Github CI CD.
Не забывай верифицировать `src/Dockerfile` и `.github/workflows/*.yaml` на корректность если изменялись параметры билда.


# Конфигурация и DI
- В composition root (`Program.cs`) не читаем параметры через `GetSection`/`GetRequiredSection` во время регистрации контейнера.
- Для параметров используем декларативную регистрацию через `AddOptions(...).BindConfiguration(...).Validate...`, а значения для зависимых настроек получаем через `IOptions<T>` внутри DI-конфигурации.
- Конфигурационные файлы `src/Ebay/Server/appsettings.json` и `appsettings.Development.json` не используем для runtime-настроек backend.
- Локальные параметры запуска backend храним в `src/Ebay/Server/Properties/launchSettings.json`.

# DDD
Мы пишем по DDD
## Границы агрегатов и связи между ними
- Граница агрегата = граница транзакции и консистентности: инварианты гарантируются только внутри одного агрегата.
- Ссылки между агрегатами храним только по идентификатору (AggregateId). Прямые навигационные свойства агрегата на другой агрегат в write-model запрещены.
- Полноценные навигационные свойства (joins/includes) допустимы только в read-model для удобства чтения и построения представлений.
- Каскадные удаления/обновления в БД допускаются только внутри одного агрегата.
- Между разными агрегатами в БД используем максимум `RESTRICT` для referential integrity как техническую защиту, но не как замену бизнес-логики.

Агрегаты располагаются в сборке Server.Domain
Репозитории в сборке Server.Adapters.Driven.EF.WriteModel
Ридмодели в сборке Server.Adapters.Driven.EF.ReadModel
`Server.Application` — legacy-слой, который пока содержит нарушения ports-and-adapters.
Новый код application-слоя нужно добавлять в `Server.Application.New`, сохраняя чистую архитектуру (порты и бизнес-сценарии без инфраструктурных зависимостей).

# Hexagonal Architecture (Ports & Adapters)
К проекту применяем hexagonal architecture: зависимости должны быть направлены внутрь, к домену.

- `Server.Domain` — центр системы: доменные правила и инварианты, без зависимостей на БД, HTTP, UI, брокеры и фреймворки инфраструктуры.
- `Server.Application.New` — application-слой use-case'ов и портов:
  - входные порты (что предоставляет application) — интерфейсы сценариев;
  - выходные порты (что нужно application) — интерфейсы репозиториев/запросов/внешних шлюзов.
- `Server.Adapters.*` — реализации портов (EF, SMTP, WebApi, внешние сервисы и т.д.).
- В `Server.Application.New` запрещены ссылки на адаптеры (`Server.Adapters.*`) и инфраструктурные детали.
- `Server.Application.New` может ссылаться на `Server.Domain`; внешние библиотеки в `Server.Application.New` подключаем только в порядке исключения и с явным обоснованием.
- Composition Root (сборка контейнера DI) по умолчанию должен быть на уровне хоста/адаптеров; временные исключения фиксируем явно в PR/AGENTS.md.


# Иконки
На UI используются иконки из коллекции https://icones.js.org/collection/oi https://github.com/iconic/open-iconic или emoji 

## Пользовательские сценарии на сайте
- **Создание продукта:** пользователь создает товар на странице продуктов.
- **Переход к замерам:** после создания открывает страницу вида `/Product/{productId}/Measurements`.
- **Создание лота для продажи:** в блоке `Лоты для продажи` пользователь вводит только название и нажимает кнопку создания.
- **Выбор лота для замера:** в таблице замеров поле `Lot ID` выбирается из выпадающего списка созданных лотов.
- `Id` лота пользователь не вводит: 7-символьный идентификатор генерируется автоматически в агрегате `LotForSale` при создании и далее не изменяется.

