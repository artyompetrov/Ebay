"""API route handlers for the vacuum tube calculator service."""

from __future__ import annotations

from fastapi import APIRouter, status

from . import models
from .calculations import calculate_load_line, calculate_operating_point

router = APIRouter(prefix="/api", tags=["vacuum-tube-calculator"])


@router.get(
    "/health",
    response_model=models.HealthResponse,
    status_code=status.HTTP_200_OK,
    operation_id="get_service_health",
)
def health_check() -> models.HealthResponse:
    """Simple health check endpoint used for monitoring."""

    return models.HealthResponse(status="ok")


@router.post(
    "/operating-point",
    response_model=models.OperatingPointResponse,
    status_code=status.HTTP_200_OK,
    operation_id="calculate_operating_point",
)
def calculate_operating_point_view(
    payload: models.OperatingPointRequest,
) -> models.OperatingPointResponse:
    """Calculate the operating point metrics for a vacuum tube stage."""

    metrics = calculate_operating_point(
        plate_supply_voltage=payload.plate_supply_voltage,
        cathode_resistor=payload.cathode_resistor,
        grid_bias_voltage=payload.grid_bias_voltage,
        plate_load_resistance=payload.plate_load_resistance,
        idle_plate_current_ma=payload.idle_plate_current,
        amplification_factor=payload.amplification_factor,
        transconductance_ma_per_volt=payload.transconductance,
    )

    return models.OperatingPointResponse(**metrics.__dict__)


@router.post(
    "/load-line",
    response_model=models.LoadLineResponse,
    status_code=status.HTTP_200_OK,
    operation_id="calculate_load_line",
)
def calculate_load_line_view(
    payload: models.LoadLineRequest,
) -> models.LoadLineResponse:
    """Calculate the DC load line intercepts for the provided parameters."""

    load_line = calculate_load_line(
        plate_supply_voltage=payload.plate_supply_voltage,
        plate_load_resistance=payload.plate_load_resistance,
    )

    return models.LoadLineResponse(
        voltage_intercept=load_line.voltage_intercept,
        current_intercept=load_line.current_intercept,
        screen_voltage=payload.screen_voltage,
    )
