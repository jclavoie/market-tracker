## ADDED Requirements

### Requirement: Date range picker

The page SHALL display two date inputs (from and to) that allow the user to select a date range for historical stock data. The default range SHALL be the last 7 days. Changing either date SHALL trigger a data refresh. The "from" date SHALL NOT exceed the "to" date.

#### Scenario: Default date range is last 7 days

- **WHEN** the page first loads with no URL parameters
- **THEN** the "from" date is set to 7 days ago and the "to" date is set to today

#### Scenario: Changing date range refreshes data

- **WHEN** the user changes the "from" date to 2026-05-01
- **THEN** the table and charts refresh with data from the new date range

### Requirement: State persistence across page reloads

The system SHALL persist the selected symbols and date range using URL query parameters (`?symbols=` and `?from=` and `?to=`) and localStorage. On page load, the system SHALL restore state from URL parameters first, then localStorage, then defaults.

#### Scenario: State restored from URL

- **WHEN** a user navigates to `/?symbols=AAPL,TSLA&from=2026-05-01&to=2026-06-01`
- **THEN** the watchlist shows AAPL and TSLA with the specified date range

#### Scenario: State saved to localStorage on change

- **WHEN** the user adds NVDA to the watchlist
- **THEN** the updated symbol list is saved to localStorage

### Requirement: Dynamic data table

The page SHALL display a table of stock data for the selected date. The table SHALL show columns: Symbol, Open, Close, Change, Change %. Positive changes SHALL be green; negative changes SHALL be red. The table SHALL update when symbols or date range change.

#### Scenario: Table updates when symbol added

- **WHEN** the user adds TSLA to the watchlist
- **THEN** the table refreshes to include TSLA data for the selected date alongside existing symbols

#### Scenario: Table shows latest date's data

- **WHEN** the date range is 2026-05-27 to 2026-06-03
- **THEN** the table shows open/close/change data for 2026-06-03 (the "to" date)

#### Scenario: Empty table for no data

- **WHEN** no stock data is available for the selected date range
- **THEN** the table displays "No stock data available"
