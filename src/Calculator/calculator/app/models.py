"""Pydantic models describing the request and response payloads."""

from __future__ import annotations

from pydantic import BaseModel, Field


class CompareResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str = Field(..., description="Static message indicating service availability.")


class HealthResponse(BaseModel):
    """Response model for health check endpoint."""

    status: str = Field(..., description="Static message indicating service availability.")
