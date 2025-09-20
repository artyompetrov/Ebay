# syntax=docker/dockerfile:1
FROM python:3.11-slim as base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY Calculator /app

RUN pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir /app

ENV PYTHONPATH=/app

EXPOSE 8080

CMD ["uvicorn", "calculator.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
