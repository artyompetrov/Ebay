from __future__ import annotations

from fastapi import APIRouter, status

from . import models
from .calculations import calculate_load_line, calculate_operating_point

router = APIRouter(prefix="/api", tags=["calculator"])


@router.get(
    "/health",
    response_model=models.HealthResponse,
    status_code=status.HTTP_200_OK,
    operation_id="get_service_health",
)
def health_check() -> models.HealthResponse:
    """Simple health check endpoint used for monitoring."""

    return models.HealthResponse(status="ok")



@router.get(
    "/compare_tubes",
    response_model=models.CompareResponse,
    status_code=status.HTTP_200_OK,
    operation_id="compare_tubes",
)
def health_check() -> models.CompareResponse:
    """Simple health check endpoint used for monitoring."""

    return models.CompareResponse(status="ok")
