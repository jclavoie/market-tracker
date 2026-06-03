## ADDED Requirements

### Requirement: Autocomplete search for stock symbols

The page SHALL display a search input that fetches matching stock symbols from `/api/search` as the user types. Results SHALL appear in a dropdown list below the input. Each result SHALL display the symbol, company name, and exchange.

#### Scenario: User types in search bar

- **WHEN** the user types "apple" in the search input
- **THEN** a dropdown appears showing matching stocks including AAPL (Apple Inc., NASDAQ)

#### Scenario: No results found

- **WHEN** the user types a query with no matching stocks
- **THEN** the dropdown shows a "No results found" message

#### Scenario: Click result adds symbol

- **WHEN** the user clicks a search result
- **THEN** the symbol is added to the watchlist as a pill/tag
- **AND** the search input is cleared
- **AND** the dropdown closes

### Requirement: Manage watchlist with removable symbol pills

The page SHALL display the current watchlist as a row of pills (tags) next to the search bar. Each pill SHALL show the symbol and a remove button (×). Clicking the remove button SHALL remove the symbol from the watchlist.

#### Scenario: Remove a symbol from watchlist

- **WHEN** the user clicks the × button on the "MSFT" pill
- **THEN** MSFT is removed from the watchlist
- **AND** the table and charts update to exclude MSFT data

#### Scenario: Prevent duplicate symbols

- **WHEN** the user tries to add AAPL when AAPL is already in the watchlist
- **THEN** AAPL is not added again (no duplicate pills)
