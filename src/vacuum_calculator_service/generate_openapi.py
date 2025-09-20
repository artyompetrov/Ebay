"""Generate the OpenAPI specification for the vacuum tube calculator service."""

from __future__ import annotations

import json
from pathlib import Path

from vacuum_calculator_service.app import create_app


def main() -> None:
    app = create_app()
    openapi_schema = app.openapi()

    output_path = Path(__file__).resolve().parent / "openapi" / "vacuum-calculator.openapi.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(json.dumps(openapi_schema, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
