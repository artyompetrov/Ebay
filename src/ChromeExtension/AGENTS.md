# AGENTS.md for src/ChromeExtension

Правила для Chrome extension в `src/ChromeExtension`.

## Code style
- Используйте статическую типизацию TypeScript.
- Не используйте `any`, если можно описать корректный тип.
- Указывайте входные и выходные типы функций.
- Переиспользуемые утилиты выносите в `src/infrastructure`.

## Сборка перед PR
- `cd /workspace/Ebay/src/ChromeExtension && npm run build`
