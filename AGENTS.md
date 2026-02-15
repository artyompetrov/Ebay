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

## Настройки сборки
- Файл `src/Ebay/Directory.Build.props` включает проверки на nullable reference types, implicit usings и рассматривает предупреждения как ошибки. Убедитесь, что проекты .NET собираются без предупреждений.

## Project Structure for OpenAI Codex Navigation

- `.github/workflows/build-and-tests.yaml` - основная CI/CD сборка docker-образов и деплой
- `.github/workflows/mega-linter.yml.todo` - заготовка для линтера (пока не активна как workflow)
- `/src`: исходный код
    - `/ChromeExtension`: Хром расширение
      - `/src/infrastructure`: общие утилиты и вспомогательные функции расширения. Добавляйте сюда переиспользуемые функции, чтобы избегать дублирования кода.
    - `/Ebay`: C# проект
      - `/Client`: Фронтенд на blazor webassembly
      - `/Server.Application`: новая чистая application-сборка для поэтапной миграции на порты и адаптеры
      - `/Server.Application.Legacy`: легаси-сборка со старым смешанным кодом, из которой функциональность переносится постепенно
      - `/Server.*`: Серверные сборки (проект чуть-чуть разбит на порты и адаптеры, но не до конца)
      - `/Server.Contracts`: OpenAPI контракты (legacy и новые контракты для поэтапной миграции)
      - `/Tests`: тесты, запускаемые вручную (в основном для валидации продакшен-базы)
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
> ⚠️ Эта секция актуальна только для запуска Codex-агента в облаке (Linux-машина без заранее подготовленной инфраструктуры).
> Если разработка ведется не в облаке, в локальной dev-среде инфраструктура обычно уже настроена (PostgreSQL уже установлен и запущен, отдельная ручная установка не требуется).

Ниже минимальная рабочая инструкция для cloud Linux-окружения агента.

1. Установить PostgreSQL:
   - `sudo apt-get update`
   - `sudo apt-get install -y postgresql`

2. Запустить кластер и проверить статус:
   - `sudo pg_ctlcluster 16 main start`
   - `pg_lsclusters`

3. Создать пользователя и БД под текущие dev-настройки проекта:
   - ```bash
     sudo -u postgres psql -v ON_ERROR_STOP=1 <<'SQL'
     DO $$
     BEGIN
       IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname='ebay') THEN
         CREATE ROLE ebay LOGIN PASSWORD 'catnip0-spoil4-untrimmed';
       ELSE
         ALTER ROLE ebay WITH LOGIN PASSWORD 'catnip0-spoil4-untrimmed';
       END IF;
     END
     $$;
     SELECT 'CREATE DATABASE ebay OWNER ebay'
     WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname='ebay')\gexec
     ALTER ROLE ebay CREATEROLE CREATEDB;
     SQL
     ```

4. Запустить backend (без launch profile, с рабочим портом БД `15432`):
   - ```bash
     ASPNETCORE_ENVIRONMENT=Development \
     ConnectionStrings__DefaultConnection='User ID=ebay;Password=catnip0-spoil4-untrimmed;Server=localhost;Port=15432;Database=ebay;Pooling=true;MinPoolSize=1;MaxPoolSize=60;Enlist=true;Include Error Detail=true;' \
     dotnet run --no-launch-profile --project /workspace/Ebay/src/Ebay/Server/Server.csproj --urls http://0.0.0.0:5080
     ```

5. Проверить, что API отвечает:
   - `curl -i http://127.0.0.1:5080/chrome_extensions/auth` (ожидается `200 OK`)
   - `curl -i http://127.0.0.1:5080/chrome_extensions/<extension>.xml`

6. Полезные замечания для отладки:
   - В проекте для Postgres используем порт `15432`.
   - Первый запуск может применять EF Core миграции и миграции MassTransit в БД.
   - Тесты проекта требуют наличия установленной и доступной БД (PostgreSQL).
   - При разработке UI-фич агенту полезно открыть приложение в браузере и визуально проверить финальный результат (клики по основным сценариям + скриншоты при заметных UI-изменениях).
   - Если не нужен полный стек фоновых задач, все равно проверяйте, что приложение поднимается и слушает порт (`Now listening on: http://0.0.0.0:5080`).

# Присылай Pull Request только если проект успешно собирается
После завершения кодирования проверяй, что у тебя собираются и C#-проект, и Chrome extension.
Если проект не собирается — нужно исправить билд перед созданием Pull Request.

# Актуализация AGENTS.md
Если в рамках задачи изменились правила разработки, структура проекта, процесс сборки/тестирования, кодогенерации, деплоя или другие договоренности, которые должны быть зафиксированы для следующих задач — обнови `AGENTS.md` в этом же PR.

# Миграция БД
Миграции находятся в проекте Server.Application в папке migrations.
Также обрати внимание на файл ApplicationDbContext.cs при изменении схемы БД.
Миграции БД не пишем вручную — генерируем миграции через Entity Framework. Пример запуска кодогенератора миграций:
cd /workspace/Ebay/src/Ebay/ && dotnet ef migrations add NewMigrationName --project Server.Application.Legacy --startup-project Server

# Сборка в docker и CI CD
Проект собирается в Docker при помощи Github CI CD.
Не забывай верифицировать `src/Dockerfile` и `.github/workflows/*.yaml` на корректность если изменялись параметры билда.

# DDD
Мы пишем по DDD
Агрегаты располагаются в сборке Server.Domain
Репозитории в сборке Server.Adapters.EF.WriteModel
Ридмодели в сборке Server.Adapters.EF.ReadModel
Server.Application должен содержать только порты и бизнес сценарии (сейчас не совсем так - но это легаси, сейчас стараемся выносить взаимодействие с внешним миром в адаптеры)


# Иконки
На UI используются иконки из коллекции https://icones.js.org/collection/oi https://github.com/iconic/open-iconic или emoji 
