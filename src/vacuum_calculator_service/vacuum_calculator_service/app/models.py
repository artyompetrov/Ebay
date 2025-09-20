"""Pydantic models describing the request and response payloads."""

from __future__ import annotations

from pydantic import BaseModel, Field


class OperatingPointRequest(BaseModel):
    """Parameters describing the operating point of a vacuum tube stage."""

    plate_supply_voltage: float = Field(
        ...,
        description=(
            "B+ or plate supply voltage in volts provided to the anode circuit."
        ),
        examples=[300.0],
    )
    cathode_resistor: float = Field(
        ..., description="Cathode resistor value in ohms used for biasing.", examples=[470.0]
    )
    grid_bias_voltage: float = Field(
        ...,
        description="Bias voltage between grid and cathode in volts (negative value for triodes).",
        examples=[-12.5],
    )
    plate_load_resistance: float = Field(
        ...,
        description="AC plate load resistance in ohms seen by the anode (e.g. transformer primary).",
        examples=[50000.0],
    )
    idle_plate_current: float = Field(
        ..., description="Idle anode current in milliamperes.", examples=[12.0]
    )
    amplification_factor: float = Field(
        ..., description="Amplification factor (mu) of the tube.", examples=[100.0]
    )
    transconductance: float = Field(
        ..., description="Transconductance (gm) in millisiemens.", examples=[2.2]
    )


class OperatingPointResponse(BaseModel):
    """Calculated metrics for a vacuum tube operating point."""

    plate_current_amp: float = Field(
        ..., description="Idle plate current converted to amperes.", examples=[0.012]
    )
    cathode_voltage: float = Field(
        ..., description="Voltage developed across the cathode resistor in volts.", examples=[5.64]
    )
    effective_grid_voltage: float = Field(
        ..., description="Grid-to-cathode voltage taking self-bias into account.", examples=[-18.14]
    )
    plate_dissipation: float = Field(
        ..., description="Plate power dissipation in watts.", examples=[3.6]
    )
    small_signal_gain: float = Field(
        ..., description="Estimated small-signal voltage gain.", examples=[42.5]
    )
    load_line_intercept_voltage: float = Field(
        ..., description="Plate voltage intercept of the DC load line in volts.", examples=[282.4]
    )
    load_line_intercept_current: float = Field(
        ..., description="Plate current intercept of the DC load line in amperes.", examples=[0.025]
    )


class LoadLineRequest(BaseModel):
    """Parameters describing a load line calculation."""

    plate_supply_voltage: float = Field(
        ..., description="B+ or plate supply voltage in volts.", examples=[300.0]
    )
    plate_load_resistance: float = Field(
        ..., description="Plate load resistance in ohms.", examples=[50000.0]
    )
    screen_voltage: float | None = Field(
        None,
        description="Optional screen voltage in volts for tetrodes/pentodes.",
        examples=[250.0],
    )


class LoadLineResponse(BaseModel):
    """Response describing the DC load line end points."""

    voltage_intercept: float = Field(
        ..., description="Voltage axis intercept of the load line in volts."
    )
    current_intercept: float = Field(
        ..., description="Current axis intercept of the load line in amperes."
    )
    screen_voltage: float | None = Field(
        None,
        description="Screen voltage repeated for reference if provided.",
    )


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str = Field(..., description="Static message indicating service availability.")
