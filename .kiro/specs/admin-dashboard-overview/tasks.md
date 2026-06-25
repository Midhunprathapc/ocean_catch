# Implementation Plan: Admin Dashboard Overview

## Overview

This plan implements a sales analytics overview section for the existing admin dashboard. It covers:
1. A pure utility module (`src/lib/sales-aggregator.ts`) with testable aggregation logic
2. A new API endpoint (`/api/admin/sales`) that computes sales metrics per time period
3. A custom data-fetching hook (`src/hooks/useSalesData.ts`) with AbortController support
4. Frontend components (SalesOverview, SummaryCards, SalesTrendCharts, BestProductsList, TimePeriodSelector) integrated into the existing DashboardView

## Tasks

- [x] 1. Create sales aggregation utility module
  - [x] 1.1 Implement pure utility functions in `src/lib/sales-aggregator.ts`
    - Create the file with TypeScript interfaces: `OrderData`, `Period`, `AggregationEntry`, `ProductPerformance`, `SummaryStats`
    - Implement `validatePeriod(period: string): period is Period` — returns true only for "daily", "weekly", "monthly"
    - Implement `validateDateRange(startDate: string, endDate: string): { valid: boolean; error?: string }` — checks ISO format, start <= end, span <= 365 days
    - Implement `getDefaultDateRange(period: Period): { startDate: Date; endDate: Date }` — last 30 days for daily, last 12 weeks for weekly, last 12 months for monthly
    - Implement `filterQualifyingOrders(orders: OrderData[]): OrderData[]` — keeps only CONFIRMED, PROCESSING, DELIVERED
    - Implement `getPeriodLabel(date: Date, period: Period): string` — returns ISO date for daily, ISO week for weekly, year-month for monthly
    - Implement `aggregateByPeriod(orders: OrderData[], period: Period): AggregationEntry[]` — groups qualifying orders by period label, computes orderCount and revenue per bucket
    - Implement `computeBestProducts(orders: OrderData[], limit?: number): ProductPerformance[]` — ranks products by total quantity desc, revenue desc as tiebreaker, max 10
    - Implement `computeSummaryStats(orders: OrderData[]): SummaryStats` — totalOrders, totalRevenue, averageOrderValue, uniqueProductsSold
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7, 1.8, 1.9, 1.10, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8, 6.1, 6.2, 6.3, 6.4, 6.6_

  - [ ]* 1.2 Write property test: Aggregation grouping preserves order count
    - **Property 1: Aggregation grouping preserves order count**
    - **Validates: Requirements 1.1, 1.2, 1.3**

  - [ ]* 1.3 Write property test: Status filtering excludes non-qualifying orders
    - **Property 2: Status filtering excludes non-qualifying orders**
    - **Validates: Requirements 1.4, 2.2**

  - [ ]* 1.4 Write property test: Aggregation entries contain required fields
    - **Property 3: Aggregation entries contain required fields**
    - **Validates: Requirements 1.5**

  - [ ]* 1.5 Write property test: Invalid period parameter produces error
    - **Property 4: Invalid period parameter produces error**
    - **Validates: Requirements 1.8, 2.9**

  - [ ]* 1.6 Write property test: Invalid date range produces error
    - **Property 5: Invalid date range produces error**
    - **Validates: Requirements 1.9, 1.10**

  - [ ]* 1.7 Write property test: Best products ranking correctness
    - **Property 6: Best products ranking correctness**
    - **Validates: Requirements 2.1, 2.8**

  - [ ]* 1.8 Write property test: Product performance entry completeness
    - **Property 7: Product performance entry completeness**
    - **Validates: Requirements 2.3**

  - [ ]* 1.9 Write property test: Summary statistics consistency
    - **Property 8: Summary statistics consistency**
    - **Validates: Requirements 6.1, 6.2, 6.3**

  - [ ]* 1.10 Write property test: Unique products count accuracy
    - **Property 9: Unique products count accuracy**
    - **Validates: Requirements 6.4**

- [x] 2. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 3. Implement sales API endpoint
  - [x] 3.1 Create `src/app/api/admin/sales/route.ts` with GET handler
    - Accept query parameters: `period` (required), `startDate` (optional), `endDate` (optional)
    - Validate admin secret using existing `validateAdminSecret` helper
    - Apply `adminRateLimit` middleware
    - Use `validatePeriod` and `validateDateRange` from utility module; return 400 on invalid input
    - Query orders from database filtered by status (CONFIRMED, PROCESSING, DELIVERED) and date range using Prisma
    - Query order items grouped by productName for best products using Prisma `groupBy`
    - Call pure utility functions (`aggregateByPeriod`, `computeBestProducts`, `computeSummaryStats`) with fetched data
    - Return `SalesResponse` shape: `{ summary, timeSeries, bestProducts }`
    - Handle database errors with 500 response
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_

  - [ ]* 3.2 Write unit tests for the sales API route
    - Test 400 response for invalid period parameter
    - Test 400 response for malformed date range
    - Test 401 response for missing/invalid admin secret
    - Test empty array response when no qualifying orders exist
    - Test correct response shape with mocked Prisma data
    - _Requirements: 1.6, 1.8, 1.9_

- [x] 4. Implement custom data-fetching hook
  - [x] 4.1 Create `src/hooks/useSalesData.ts`
    - Define `UseSalesDataReturn` interface with `data`, `loading`, `error`, `period`, `setPeriod`, `retry`
    - Default period to "monthly" on initial load
    - Use AbortController to cancel in-flight requests when period changes
    - Fetch from `/api/admin/sales?period=<period>` with `x-admin-secret` header from sessionStorage
    - Handle loading, error, and success states
    - Expose `retry` function to re-fetch on user action
    - _Requirements: 4.2, 4.4, 4.5, 4.6, 3.5, 3.6_

  - [ ]* 4.2 Write unit tests for useSalesData hook
    - Test default period is "monthly"
    - Test request cancellation when period changes rapidly
    - Test error state and retry behavior
    - _Requirements: 4.4, 4.6_

- [x] 5. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 6. Implement frontend components
  - [x] 6.1 Create `src/app/admin/components/SalesOverview.tsx` with TimePeriodSelector
    - Create the SalesOverview wrapper component that uses `useSalesData` hook
    - Implement TimePeriodSelector sub-component with Day/Week/Month tab buttons
    - Apply visually distinct active style (cyan highlight) to selected period matching existing design system
    - On period change, call `setPeriod` from the hook to trigger data re-fetch
    - Show loading spinner (border-2 border-cyan-500 pattern) while data is loading
    - Show error message with retry button on fetch failure
    - Use framer-motion animations (opacity 0→1, y 16→0, duration 0.3s) matching existing pattern
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 3.5, 3.6, 3.7, 3.8, 7.2, 7.4, 7.5_

  - [x] 6.2 Implement SummaryCards sub-component within SalesOverview
    - Display 4 cards in a responsive grid: Total Orders, Total Revenue (₹ formatted), Average Order Value (₹ formatted), Unique Products Sold
    - Use slate-900 backgrounds, cyan accents, rounded-2xl styling, slate-800/60 borders
    - Show zero values when no qualifying orders exist
    - Show error indication with retry when API fails
    - Responsive layout: single-column < 640px, two-column 640-1023px, four-column >= 1024px
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 7.2, 7.3_

  - [x] 6.3 Implement SalesTrendCharts sub-component within SalesOverview
    - Render a bar chart (order count) using recharts `BarChart`, `Bar`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`
    - Render a line chart (revenue in ₹) using recharts `LineChart`, `Line`, `XAxis`, `YAxis`, `Tooltip`, `ResponsiveContainer`
    - X-axis shows period labels, Y-axis shows counts/revenue
    - Implement tooltips showing exact order count and revenue on hover
    - Show "No sales data available" message for empty datasets
    - Apply dark theme chart styling consistent with existing category chart (slate backgrounds, cyan accents)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.7_

  - [x] 6.4 Implement BestProductsList sub-component within SalesOverview
    - Display ranked list of up to 10 products with rank position, product name, total quantity, total revenue
    - Render a horizontal bar chart using recharts for visual comparison
    - Show "No sales data available" message when no products sold in period
    - Refresh automatically when time period changes
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 6.5 Write unit tests for SalesOverview components
    - Test loading state renders spinner
    - Test error state renders error message with retry button
    - Test empty state renders "no data" message
    - Test TimePeriodSelector highlights active period
    - Test SummaryCards render correct values from mock data
    - _Requirements: 3.5, 3.6, 3.7, 4.3, 6.6, 6.7_

- [x] 7. Integrate SalesOverview into existing DashboardView
  - [x] 7.1 Wire SalesOverview into `src/app/admin/components/AdminDashboard.tsx`
    - Import and render `SalesOverview` component inside the existing `DashboardView` function
    - Position it above the current product statistics section (stats grid)
    - Use 24px gap (`space-y-6` already in place) between overview and existing sections
    - Ensure existing product stats, category chart, stock pie chart, and recent products still render correctly
    - SalesOverview errors must not disrupt existing dashboard sections (use error boundary or try/catch in the component)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 7.2 Write integration tests for dashboard with SalesOverview
    - Test that SalesOverview renders within DashboardView
    - Test that existing dashboard sections still render when SalesOverview errors
    - Test responsive layout at different breakpoints
    - _Requirements: 7.6, 7.7_

- [x] 8. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The `recharts` library is already in project dependencies — no new charting library needed
- The `fast-check` library needs to be added as a dev dependency for property-based tests
- All frontend components use the existing dark theme design system (slate-900, cyan accents, framer-motion)
- The `useSalesData` hook uses AbortController for request cancellation per Requirement 4.6

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["1.2", "1.3", "1.4", "1.5", "1.6", "1.7", "1.8", "1.9", "1.10"] },
    { "id": 2, "tasks": ["3.1", "4.1"] },
    { "id": 3, "tasks": ["3.2", "4.2"] },
    { "id": 4, "tasks": ["6.1"] },
    { "id": 5, "tasks": ["6.2", "6.3", "6.4"] },
    { "id": 6, "tasks": ["6.5", "7.1"] },
    { "id": 7, "tasks": ["7.2"] }
  ]
}
```
