# Requirements Document

## Introduction

This feature adds a sales analytics dashboard overview section to the existing admin panel of the Sea Harvest Premium Seafoods e-commerce store. The overview displays sales metrics (number of sales per day, per week, per month) derived entirely from existing order data, highlights best-performing products and order trends, and presents the information through interactive chart-based UI with time-period sort/filter controls for granular analysis.

## Glossary

- **Dashboard_Overview**: The new analytics section added to the existing admin panel dashboard view that displays sales and product performance metrics with charts.
- **Sales_Aggregator**: The backend service responsible for querying order data and computing aggregated sales counts grouped by time period.
- **Time_Period_Selector**: A UI control that allows the admin to switch the analysis view between daily, weekly, and monthly granularity.
- **Order**: An existing database entity representing a customer purchase, containing items, total amount, status, and timestamps.
- **OrderItem**: An existing database entity representing a single line item within an order, containing product reference, price, and quantity.
- **Best_Performing_Product**: A product ranked by total quantity sold or total revenue generated from completed orders within the selected time period.
- **Sales_Chart**: A visual chart component (bar or line) rendering aggregated sales data over time.
- **Admin_Panel**: The existing authenticated admin interface at the `/admin` route of the application.

## Requirements

### Requirement 1: Sales Count Aggregation API

**User Story:** As an admin, I want to retrieve aggregated sales counts grouped by day, week, or month, so that I can understand sales volume trends over time.

#### Acceptance Criteria

1. WHEN the Admin_Panel requests sales data with a "daily" period parameter, THE Sales_Aggregator SHALL return the count of orders grouped by each calendar day for the requested date range.
2. WHEN the Admin_Panel requests sales data with a "weekly" period parameter, THE Sales_Aggregator SHALL return the count of orders grouped by ISO 8601 calendar week (Monday as the first day of the week) for the requested date range.
3. WHEN the Admin_Panel requests sales data with a "monthly" period parameter, THE Sales_Aggregator SHALL return the count of orders grouped by calendar month for the requested date range.
4. THE Sales_Aggregator SHALL include only orders with status CONFIRMED, PROCESSING, or DELIVERED in the sales count calculations.
5. THE Sales_Aggregator SHALL return each aggregation entry with a period label (ISO 8601 date string for daily, ISO week identifier for weekly, year-month for monthly), order count, and total revenue for that period.
6. IF the requested date range contains no orders, THEN THE Sales_Aggregator SHALL return an empty array with a total count of zero and total revenue of zero.
7. WHEN no date range is specified, THE Sales_Aggregator SHALL default to the last 30 days for daily view, last 12 weeks for weekly view, and last 12 months for monthly view.
8. IF the period parameter is not one of "daily", "weekly", or "monthly", THEN THE Sales_Aggregator SHALL return an error response indicating the invalid period value without processing any data.
9. IF the date range is malformed or the start date is after the end date, THEN THE Sales_Aggregator SHALL return an error response indicating the invalid date range without processing any data.
10. THE Sales_Aggregator SHALL accept date range parameters as ISO 8601 date strings (YYYY-MM-DD) and limit the maximum queryable span to 365 days.

### Requirement 2: Best Performing Products API

**User Story:** As an admin, I want to see which products sell the most within a selected time period, so that I can make informed inventory and marketing decisions.

#### Acceptance Criteria

1. WHEN the Admin_Panel requests best-performing products with a time period parameter, THE Sales_Aggregator SHALL return up to 10 products ranked by total quantity sold in descending order within that period, returning fewer than 10 if fewer products have sales data.
2. THE Sales_Aggregator SHALL compute product performance using OrderItem data linked to orders with status CONFIRMED, PROCESSING, or DELIVERED.
3. THE Sales_Aggregator SHALL return each product entry with the product name, total quantity sold, total revenue generated (computed as the sum of price multiplied by quantity from each OrderItem), and number of distinct orders containing that product.
4. WHEN the time period is "daily", THE Sales_Aggregator SHALL calculate performance for the current calendar day based on the server's configured timezone.
5. WHEN the time period is "weekly", THE Sales_Aggregator SHALL calculate performance for the current calendar week (Monday through Sunday) based on the server's configured timezone.
6. WHEN the time period is "monthly", THE Sales_Aggregator SHALL calculate performance for the current calendar month based on the server's configured timezone.
7. IF no orders exist within the selected time period, THEN THE Sales_Aggregator SHALL return an empty array.
8. IF two or more products have the same total quantity sold, THEN THE Sales_Aggregator SHALL rank them by total revenue in descending order as a tiebreaker.
9. IF the time period parameter is not one of "daily", "weekly", or "monthly", THEN THE Sales_Aggregator SHALL return an error response indicating the provided time period is invalid.

### Requirement 3: Sales Trend Chart Display

**User Story:** As an admin, I want to view sales data as interactive charts in the dashboard, so that I can visually identify trends and patterns.

#### Acceptance Criteria

1. THE Dashboard_Overview SHALL display a bar chart showing sales count (number of orders) over the selected time period, with the x-axis labeled by period identifier (date, week, or month) and the y-axis labeled by order count.
2. THE Dashboard_Overview SHALL display a line chart showing revenue trends over the selected time period, with the x-axis labeled by period identifier and the y-axis labeled by revenue amount in the store currency (₹).
3. WHEN the admin hovers over a data point on a chart, THE Dashboard_Overview SHALL display a tooltip showing the exact order count and revenue for that period.
4. THE Dashboard_Overview SHALL render charts using the recharts library already present in the project dependencies.
5. WHILE sales data is being fetched, THE Dashboard_Overview SHALL display a loading indicator within the chart area.
6. IF the API returns an error, THEN THE Dashboard_Overview SHALL display an error message with a retry option within the chart area, and the retry option SHALL re-initiate the data fetch when clicked.
7. IF the API returns an empty data set for the selected period, THEN THE Dashboard_Overview SHALL display a message indicating no sales data is available for the selected time period in place of the charts.
8. WHEN the retry fetch succeeds after a previous error, THE Dashboard_Overview SHALL replace the error message with the rendered charts.

### Requirement 4: Time Period Selector Control

**User Story:** As an admin, I want to switch between daily, weekly, and monthly views, so that I can analyze sales at different granularities.

#### Acceptance Criteria

1. THE Dashboard_Overview SHALL display a Time_Period_Selector with three options: Day, Week, and Month.
2. WHEN the admin selects a time period option, THE Dashboard_Overview SHALL fetch and render the sales data and charts corresponding to the selected granularity within 3 seconds of the selection.
3. THE Time_Period_Selector SHALL apply a visually distinct style (such as highlighted background or active border) to the currently selected time period option, differentiating it from the unselected options.
4. THE Dashboard_Overview SHALL default to the "Month" time period on initial load, with the Month option shown as active in the Time_Period_Selector.
5. WHEN the time period changes, THE Dashboard_Overview SHALL update the sales trend charts and the best-performing products list in a single render cycle, without displaying stale data from the previous period in either section.
6. IF the admin selects a new time period while a previous data request is still in progress, THEN THE Dashboard_Overview SHALL cancel the previous request and fetch data for the newly selected period only.

### Requirement 5: Best Performing Products Display

**User Story:** As an admin, I want to see top-selling products displayed in the dashboard with clear ranking, so that I can quickly identify product performance.

#### Acceptance Criteria

1. THE Dashboard_Overview SHALL display a ranked list of the top 10 best-performing products for the selected time period.
2. THE Dashboard_Overview SHALL show each product entry with its rank position, product name, total quantity sold, and total revenue.
3. THE Dashboard_Overview SHALL display a horizontal bar chart visualizing product performance by quantity or revenue.
4. WHEN no products have been sold in the selected period, THE Dashboard_Overview SHALL display a message indicating no sales data is available.
5. WHEN the time period changes via the Time_Period_Selector, THE Dashboard_Overview SHALL refresh the best-performing products list accordingly.

### Requirement 6: Summary Statistics Cards

**User Story:** As an admin, I want to see key sales metrics at a glance in summary cards, so that I can quickly assess current business performance.

#### Acceptance Criteria

1. THE Dashboard_Overview SHALL display a summary card showing the total number of orders with status CONFIRMED, PROCESSING, or DELIVERED for the selected time period.
2. THE Dashboard_Overview SHALL display a summary card showing the total revenue (sum of totalAmount from qualifying orders) formatted as a currency value with the ₹ symbol and two decimal places for the selected time period.
3. THE Dashboard_Overview SHALL display a summary card showing the average order value, calculated as total revenue divided by total number of qualifying orders, formatted as a currency value with the ₹ symbol and two decimal places for the selected time period.
4. THE Dashboard_Overview SHALL display a summary card showing the total number of unique products sold (distinct productId values from OrderItems linked to qualifying orders) in the selected time period.
5. WHEN the time period changes via the Time_Period_Selector, THE Dashboard_Overview SHALL update all summary cards to reflect the new period's data within 3 seconds.
6. IF no qualifying orders exist for the selected time period, THEN THE Dashboard_Overview SHALL display zero for order count, revenue, and average order value, and zero for unique products sold.
7. IF the summary statistics API request fails, THEN THE Dashboard_Overview SHALL display an error indication within the card area and provide a retry option.

### Requirement 7: Integration with Existing Dashboard

**User Story:** As an admin, I want the sales overview to be part of the existing dashboard view, so that I can access all admin information from a single location.

#### Acceptance Criteria

1. THE Dashboard_Overview SHALL be rendered within the existing DashboardView component of the Admin_Panel, positioned above the current product statistics section, separated by the same vertical spacing (24px gap) used between existing dashboard sections.
2. THE Dashboard_Overview SHALL follow the existing dark theme design system using slate-900 backgrounds, cyan accent colors, rounded-2xl card styling, and slate-800/60 border styling consistent with the current admin panel cards.
3. THE Dashboard_Overview SHALL adapt its layout using the existing Tailwind breakpoints: single-column below 640px (sm), two-column grid between 640px and 1023px, and multi-column grid at 1024px (lg) and above.
4. THE Dashboard_Overview SHALL use framer-motion animations with the same entry pattern used by existing dashboard sections: opacity 0 to 1, vertical offset of 16px to 0, and transition duration of 0.3 seconds.
5. WHILE the Dashboard_Overview data loads, THE Dashboard_Overview SHALL display a centered spinning loader element matching the existing dashboard loading pattern (border-2 border-cyan-500 spinner).
6. IF the Dashboard_Overview fails to load data, THEN THE Dashboard_Overview SHALL display an inline error message within the overview section without disrupting the rendering of existing product statistics, stock status, and recent products sections below it.
7. THE Dashboard_Overview SHALL not prevent the existing DashboardView content (product statistics cards, category chart, stock status pie chart, recent products list) from rendering and functioning correctly.
