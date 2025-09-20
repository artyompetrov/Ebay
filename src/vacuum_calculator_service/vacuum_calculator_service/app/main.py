"""ASGI application for the vacuum tube calculator service."""

from __future__ import annotations

from fastapi import FastAPI

from . import models
from .routes import router


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""

    app = FastAPI(
        title="Vacuum Tube Calculator Service",
        version="0.1.0",
        description=(
            "Microservice providing analytical calculations for vacuum tube stages "
            "used in audio and radio circuits."
        ),
    )

    @app.get(
        "/",
        response_model=models.HealthResponse,
        tags=["vacuum-tube-calculator"],
        operation_id="get_root_health",
    )
    def root() -> models.HealthResponse:  # pragma: no cover - thin wrapper
        """Expose a default root endpoint mirroring the health check."""

        return models.HealthResponse(status="ok")

    app.include_router(router)

    return app


app = create_app()
