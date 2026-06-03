## Purpose

Line and bar charts rendering stock price trends and daily percentage changes using Chart.js.

## Requirements

### Requirement: Line chart of closing prices over time

The page SHALL display a line chart showing each selected symbol's closing price over the selected date range. The x-axis SHALL show dates and the y-axis SHALL show price. Each symbol SHALL be a separate colored line with a legend.

#### Scenario: Single symbol line chart

- **WHEN** the watchlist contains only AAPL with data from 2026-05-27 to 2026-06-03
- **THEN** a line chart renders with one line showing AAPL's closing prices across those dates

#### Scenario: Multiple symbols on line chart

- **WHEN** the watchlist contains AAPL and MSFT
- **THEN** the line chart shows two distinct colored lines with a legend identifying each

#### Scenario: No data shows empty chart message

- **WHEN** the watchlist is empty or no data is available
- **THEN** the chart area displays a message "No chart data"

### Requirement: Bar chart of daily percent changes

The page SHALL display a bar chart showing each symbol's daily percentage change for the selected date range. Positive changes SHALL be green bars; negative changes SHALL be red bars. The x-axis SHALL show dates and the y-axis SHALL show percentage.

#### Scenario: Daily change bars with color coding

- **WHEN** AAPL has both positive and negative daily changes over the date range
- **THEN** the bar chart displays green bars for positive days and red bars for negative days

#### Scenario: Multiple symbols shown as grouped bars

- **WHEN** the watchlist contains AAPL and MSFT
- **THEN** each date shows grouped bars (one per symbol) distinguished by color with a legend
