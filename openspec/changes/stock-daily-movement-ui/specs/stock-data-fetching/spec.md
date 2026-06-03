## ADDED Requirements

### Requirement: Fetch daily stock data for configured symbols

The system SHALL fetch daily stock price data (open, high, low, close) for a configurable list of ticker symbols from a public stock data API. The symbol list SHALL be read from the `STOCK_SYMBOLS` environment variable as a comma-separated list (e.g., `AAPL,GOOGL,MSFT`). The API endpoint and key SHALL be configurable via `STOCK_API_URL` and `STOCK_API_KEY` environment variables, with sensible defaults that work without authentication for common public APIs.

#### Scenario: Successful data fetch for multiple symbols

- **WHEN** the server starts with `STOCK_SYMBOLS=AAPL,MSFT`
- **THEN** the stock service fetches daily data for both AAPL and MSFT from the configured API

#### Scenario: Missing environment variable uses defaults

- **WHEN** `STOCK_SYMBOLS` is not set
- **THEN** the stock service uses a default list of symbols (e.g., AAPL, GOOGL, MSFT, AMZN)

### Requirement: Return structured stock data

The system SHALL parse API responses and return an array of stock data objects, each containing: symbol (ticker), open price, close price, change (close - open), and change percent (change / open * 100). Numeric values SHALL be rounded to 2 decimal places.

#### Scenario: Calculate daily movement from API data

- **WHEN** AAPL opens at $150.00 and closes at $153.00
- **THEN** the returned data includes `{ symbol: "AAPL", open: 150.00, close: 153.00, change: 3.00, changePercent: 2.00 }`

#### Scenario: Handle negative daily movement

- **WHEN** GOOGL opens at $140.00 and closes at $137.50
- **THEN** the returned data includes `{ symbol: "GOOGL", change: -2.50, changePercent: -1.79 }`

### Requirement: Resilient error handling for API failures

The system SHALL handle API request failures gracefully. If a single symbol's data cannot be fetched, the system SHALL return available data for other symbols rather than failing entirely. If the entire API is unreachable, the system SHALL return an empty array and log the error.

#### Scenario: Partial data failure

- **WHEN** fetching data for AAPL succeeds but MSFT's API call fails
- **THEN** the service returns data for AAPL and excludes MSFT without throwing an error

#### Scenario: Complete API failure

- **WHEN** the stock API is unreachable
- **THEN** the service returns an empty array and logs the error to stderr
