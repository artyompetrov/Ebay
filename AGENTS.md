# Project AGENTS.md Guide

## О проекте
Приложение для анализа цен товаров на eBay и последующей закупки на внешних площадках.

Состав проекта:
1. Серверная часть (Docker / docker-compose).
2. Клиентская часть (Blazor WebAssembly).
3. Chrome extension для парсинга страниц eBay и сохранения данных через API.
4. БД: PostgreSQL.
5. Часть API-кода генерируется из OpenAPI-контрактов.

## Базовые инженерные правила
- Следуем SOLID, DRY, KISS.
- Избегайте копипасты; переиспользуйте существующие решения.
- Исправляйте первопричину проблемы, а не симптомы.
- Предпочитайте системные и единообразные решения локальным обходам.

## DI и сервисы
- По умолчанию регистрации в DI: `Transient`.
- `Scoped` — только когда действительно нужен общий контекст операции (в первую очередь EF `DbContext`).
- `Singleton` — только осознанно и с явным обоснованием рядом с регистрацией.
- Предпочитаем stateless-сервисы (не хранить изменяемое состояние в полях без необходимости).

## Тесты
- Для unit-тестов по возможности делаем отдельный test class на каждый production-класс.
- Добавляем `[TestOf(typeof(...))]` на test class.

## Навигация
- `.github/workflows/build-and-tests.yaml` — основная CI/CD-сборка и деплой.
- `src/Ebay` — backend + Blazor frontend (детали: `src/Ebay/AGENTS.md`).
- `src/ChromeExtension` — Chrome extension (детали: `src/ChromeExtension/AGENTS.md`).
- `src/Dockerfile` — сборка решения в контейнер.
- `deploy` — docker-compose для запуска.

## Проверки перед PR
Запускайте `./agent-check.sh` из корня репозитория.

## Актуализация AGENTS.md
Если в рамках задачи изменились правила, структура, сборка, тестирование, кодогенерация или деплой — обновите соответствующий `AGENTS.md` в этом же PR.

## Правила по слоям
Каждый слой проекта может содержать свой `AGENTS.md` с детальными ограничениями.
Найди все файлы перед внесением изменений:

```shell
rg --files --glob "AGENTS.md" "$(git rev-parse --show-toplevel)/src"
```
Если команда ничего не вывела, дополнительных правил слоёв в `src/` нет.
Прочитай каждый найденный файл. Правила слоя имеют приоритет над глобальными правилами в пределах своего слоя.

## Fix the cause, not the symptom
Don't patch symptoms (hardcodes, special cases, suppressed errors, copy-paste) — this accumulates entropy in the code.
Find and fix the root cause (an architectural gap, a broken invariant). If that's out of the task's scope —
don't apply a silent workaround; describe the root cause and mark the solution as a TODO.

## Project skills
- Project skills live in [.agents/skills/](.agents/skills/).
- To add, change, or review tests, use `$write-tests`.
- For REST API, Swagger/OpenAPI, web DTO, status codes, and error tasks, use `$web-api`.
- To add, change, or review logging, use `$logging`.
- Before creating, changing, or reviewing any `.cs` file, use `$csharp-style`.