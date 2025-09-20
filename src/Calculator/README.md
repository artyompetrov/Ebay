# Vacuum Tube Calculator Service

Этот микросервис реализован на [FastAPI](https://fastapi.tiangolo.com/) и предназначен для аналитических расчётов характеристик радиоламп.

## Запуск локально

```bash
cd src/vacuum_calculator_service
python -m venv .venv
source .venv/bin/activate
pip install -e .
uvicorn vacuum_calculator_service.app.main:app --reload --port 8080
```

Интерактивная документация будет доступна по адресу `http://localhost:8080/docs`.

## Генерация OpenAPI

Команда ниже сгенерирует контракт и положит его в папку `openapi/`:

```bash
python generate_openapi.py
```

Полученный файл `openapi/vacuum-calculator.openapi.json` следует добавлять в git, чтобы можно было генерировать клиентов на C#.
