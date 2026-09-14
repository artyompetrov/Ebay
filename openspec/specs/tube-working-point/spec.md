# tube-working-point Specification

## Purpose

Recording a tube's nominal operating point (anode/grid voltage and current, with tolerance half-widths) so it can be marked on that tube's rendered curve plot, while rejecting operating points too close to zero to be a meaningful working point.

## Requirements

### Requirement: Tube working point value validation
A tube working point's anode voltage, its anode/grid voltage half-widths, and its nominal current SHALL each be at least 0.01 in magnitude, and its grid voltage SHALL be at most -0.01 (at least 0.01 below zero). A working point violating any of these bounds SHALL be rejected.

#### Scenario: A working point with small but valid magnitudes is accepted
- **WHEN** a working point is created with a small negative grid voltage and small half-widths, each at least 0.01 in magnitude
- **THEN** the working point is created successfully with the given values

#### Scenario: A working point exactly at the boundary is accepted
- **WHEN** every bounded value of a working point is exactly at the 0.01 magnitude boundary
- **THEN** the working point is created successfully

#### Scenario: A working point below the boundary is rejected
- **WHEN** any bounded value of a working point has a smaller magnitude than 0.01
- **THEN** creating the working point fails
