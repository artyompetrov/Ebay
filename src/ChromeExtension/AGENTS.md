# AGENTS.md for src/ChromeExtension

Этот файл содержит правила для Chrome extension в `src/ChromeExtension`.

## Code style
- Старайтесь использовать статическую типизацию в TypeScript.
- Не используйте `any`, если можно описать корректный тип.
- Всегда указывайте входные и выходные параметры у функций.
- Избегайте дублирования: переиспользуемые функции выносите в `src/infrastructure`.

## Структура
- `/src/infrastructure` — общие утилиты и вспомогательные функции расширения.

## Сборка
- `cd /workspace/Ebay/src/ChromeExtension/ && npm run build`

## PR только после успешных проверок
Перед отправкой PR проверьте, что Chrome extension собирается без ошибок.
