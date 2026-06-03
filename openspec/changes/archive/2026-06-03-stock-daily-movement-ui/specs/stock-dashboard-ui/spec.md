## ADDED Requirements

### Requirement: Serve HTML stock dashboard on root path

The HTTP server SHALL serve an HTML document at the `GET /` route. The document SHALL display a table of stocks with columns: Symbol, Open, Close, Change, and Change %. The page SHALL include a title and heading indicating it is a stock market dashboard for the current date.

#### Scenario: Load dashboard page

- **WHEN** a browser requests `GET /`
- **THEN** the server responds with status 200 and `Content-Type: text/html`
- **AND** the response body is a valid HTML document containing a table of stock data

#### Scenario: Dashboard shows current date

- **WHEN** the dashboard page is loaded
- **THEN** the page displays the current date (formatted as YYYY-MM-DD)

### Requirement: Display daily stock movement data in table

The system SHALL display each stock's daily movement data in a table row. Positive changes (close > open) SHALL be displayed in green. Negative changes (close < open) SHALL be displayed in red. Zero changes SHALL be displayed without color.

#### Scenario: Positive change displayed in green

- **WHEN** a stock's close price is higher than its open price
- **THEN** the change and change % values are rendered in green

#### Scenario: Negative change displayed in red

- **WHEN** a stock's close price is lower than its open price
- **THEN** the change and change % values are rendered in red

#### Scenario: No data available

- **WHEN** the stock service returns an empty array
- **THEN** the page displays a message: "No stock data available"

### Requirement: Health check endpoint

The HTTP server SHALL respond to `GET /health` with a JSON object `{ "status": "ok" }` and status code 200.

#### Scenario: Health check returns ok

- **WHEN** a request is made to `GET /health`
- **THEN** the server responds with status 200 and `Content-Type: application/json`
- **AND** the body is `{"status":"ok"}`
