# syntax=docker/dockerfile:1
FROM python:3.11-slim as base

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

WORKDIR /app

COPY /Calculator/pyproject.toml /app/pyproject.toml
RUN pip install --no-cache-dir --upgrade pip \
    && python -m pip install --no-cache-dir \
        fastapi==0.111.0 \
        "uvicorn[standard]==0.30.0" \
        pydantic==2.7.1 \
        numpy==1.26.4

COPY Calculator /app/calculator

EXPOSE 8080

CMD ["uvicorn", "calculator.app.main:app", "--host", "0.0.0.0", "--port", "8080"]
