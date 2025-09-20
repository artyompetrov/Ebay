"""Core calculation utilities for vacuum tube analysis."""

from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class OperatingPointMetrics:
    """Computed metrics for a vacuum tube operating point."""

    plate_current_amp: float
    cathode_voltage: float
    effective_grid_voltage: float
    plate_dissipation: float
    small_signal_gain: float
    load_line_intercept_voltage: float
    load_line_intercept_current: float


@dataclass(frozen=True)
class LoadLine:
    """Represents a load line defined by its axis intercepts."""

    voltage_intercept: float
    current_intercept: float


def calculate_operating_point(
    *,
    plate_supply_voltage: float,
    cathode_resistor: float,
    grid_bias_voltage: float,
    plate_load_resistance: float,
    idle_plate_current_ma: float,
    amplification_factor: float,
    transconductance_ma_per_volt: float,
) -> OperatingPointMetrics:
    """Calculate static and small-signal parameters for a vacuum tube stage."""

    idle_plate_current_amp = idle_plate_current_ma / 1000.0
    cathode_voltage = idle_plate_current_amp * cathode_resistor
    effective_grid_voltage = grid_bias_voltage - cathode_voltage
    plate_dissipation = plate_supply_voltage * idle_plate_current_amp

    # Convert gm from mA/V to A/V for calculations.
    gm = transconductance_ma_per_volt / 1000.0

    # Estimate internal plate resistance using mu and gm relations (rp = mu / gm).
    plate_resistance = amplification_factor / gm if gm else float("inf")

    # Estimate small-signal gain using mu, rp and load resistance: Av = -mu * (RL / (RL + rp)).
    gain = -amplification_factor * (
        plate_load_resistance / (plate_load_resistance + plate_resistance)
    ) if plate_resistance != float("inf") else -amplification_factor

    load_line = calculate_load_line(
        plate_supply_voltage=plate_supply_voltage,
        plate_load_resistance=plate_load_resistance,
    )

    return OperatingPointMetrics(
        plate_current_amp=idle_plate_current_amp,
        cathode_voltage=cathode_voltage,
        effective_grid_voltage=effective_grid_voltage,
        plate_dissipation=plate_dissipation,
        small_signal_gain=gain,
        load_line_intercept_voltage=load_line.voltage_intercept,
        load_line_intercept_current=load_line.current_intercept,
    )


def calculate_load_line(
    *, plate_supply_voltage: float, plate_load_resistance: float
) -> LoadLine:
    """Calculate the voltage and current intercepts of the DC load line."""

    if plate_load_resistance <= 0:
        raise ValueError("plate_load_resistance must be positive")

    current_intercept = plate_supply_voltage / plate_load_resistance
    return LoadLine(
        voltage_intercept=plate_supply_voltage,
        current_intercept=current_intercept,
    )
