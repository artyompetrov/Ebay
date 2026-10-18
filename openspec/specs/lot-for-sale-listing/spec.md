# lot-for-sale-listing Specification

## Purpose

Assigning short, unique identifiers to lots offered for sale, so every listed lot has a valid, non-colliding id.

## Requirements

### Requirement: Lot-for-sale identifier format
A lot-for-sale id SHALL be exactly 7 characters long. Creating a lot with an id of any other length SHALL be rejected.

#### Scenario: A 7-character id is accepted
- **WHEN** a lot-for-sale is created with a 7-character id
- **THEN** the lot is created with that id

#### Scenario: An id of the wrong length is rejected
- **WHEN** a lot-for-sale is created with an id shorter than 7 characters
- **THEN** creation fails

### Requirement: Lot-for-sale identifier generation is collision-free
The system SHALL generate lot-for-sale ids such that every id produced - even when many are generated in immediate succession within the same second - is unique and matches the required 7-character length.

#### Scenario: Rapidly generated ids never collide
- **WHEN** a large number of lot-for-sale ids are generated in immediate succession
- **THEN** every generated id is unique and matches the required 7-character length

### Requirement: Lot-for-sale available quantity
The lot-for-sale list SHALL report, for every lot, its available quantity: the number of sellable units among the measurements linked to that lot whose state is not `Sold`. All measurements sharing one match id form one unit (a matched set); a measurement without a match id is one unit. Measurements linked to other lots SHALL NOT be counted.

#### Scenario: A lot without linked measurements has zero available quantity
- **WHEN** a lot for sale has no measurements linked to it
- **THEN** the lot-for-sale list reports its available quantity as 0

#### Scenario: Unmatched measurements are counted one by one
- **WHEN** a lot for sale has three linked measurements without a match id, none of them `Sold`
- **THEN** the lot-for-sale list reports its available quantity as 3

#### Scenario: A matched set is counted as one unit
- **WHEN** a lot for sale has two matched pairs (two match ids, two measurements each) and one measurement without a match id, none of them `Sold`
- **THEN** the lot-for-sale list reports its available quantity as 3

#### Scenario: Sold measurements are not counted
- **WHEN** a lot for sale has one matched pair whose measurements are `Selling` and another matched pair whose measurements are `Sold`
- **THEN** the lot-for-sale list reports its available quantity as 1

#### Scenario: Measurements in Created and Selling states are both counted
- **WHEN** a lot for sale has one unmatched measurement in state `Created` and one unmatched measurement in state `Selling`
- **THEN** the lot-for-sale list reports its available quantity as 2

#### Scenario: Measurements of another lot are not counted
- **WHEN** two lots for sale exist and two unmatched measurements are linked to the first lot only
- **THEN** the lot-for-sale list reports available quantity 2 for the first lot and 0 for the second lot
