# Spec Delta

## ADDED Requirements

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
