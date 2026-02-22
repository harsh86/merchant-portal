# QA Testing Checklist - Merchant Transaction Portal

**Testing Date:** 2026-02-21
**Tester:** QA Engineer (Claude)
**Environment:** Development
**Backend Version:** 1.0.0
**Frontend Version:** 0.0.0

---

## Backend API Testing

### Health Check Endpoint

- [ ] **GET /health**
  - [ ] Returns 200 status code
  - [ ] Response contains `status: "healthy"`
  - [ ] Response contains timestamp
  - [ ] Response contains uptime value
  - [ ] Response time < 100ms

### Webhook Endpoints

#### POST /api/webhooks/ingest - Success Cases

- [ ] **Valid webhook with complete data**
  - [ ] Returns 201 status code
  - [ ] Creates transaction in database
  - [ ] Creates webhook log in database
  - [ ] Returns transaction_id and webhook_log_id
  - [ ] Metadata stored correctly in JSONB field
  - [ ] Processing time logged

- [ ] **Valid webhook with minimal required fields**
  - [ ] Returns 201 status code
  - [ ] All required fields stored correctly
  - [ ] Optional fields handled correctly

- [ ] **Different transaction statuses**
  - [ ] pending status handled correctly
  - [ ] processing status handled correctly
  - [ ] completed status handled correctly
  - [ ] failed status handled correctly
  - [ ] refunded status handled correctly
  - [ ] cancelled status handled correctly

- [ ] **Different payment sources**
  - [ ] stripe source works
  - [ ] paypal source works
  - [ ] square source works
  - [ ] Custom source names work

#### POST /api/webhooks/ingest - Validation Errors

- [ ] **Missing required fields**
  - [ ] Returns 400 when source is missing
  - [ ] Returns 400 when merchant_id is missing
  - [ ] Returns 400 when amount is missing
  - [ ] Returns 400 when currency is missing
  - [ ] Returns 400 when status is missing
  - [ ] Returns 400 when transaction_id is missing
  - [ ] Error response includes field-specific details

- [ ] **Invalid data types**
  - [ ] Rejects non-UUID merchant_id
  - [ ] Rejects negative amount
  - [ ] Rejects string amount
  - [ ] Rejects invalid currency format (not 3 chars)
  - [ ] Rejects lowercase currency
  - [ ] Rejects invalid status value
  - [ ] Rejects uppercase source
  - [ ] Rejects source with special characters
  - [ ] Rejects empty transaction_id

- [ ] **Error response structure**
  - [ ] Contains error.code = "VALIDATION_ERROR"
  - [ ] Contains error.message
  - [ ] Contains error.details array
  - [ ] Contains error.requestId

#### POST /api/webhooks/ingest - Duplicate Handling

- [ ] **Duplicate transaction_id**
  - [ ] Returns 409 status code on duplicate
  - [ ] Error message indicates duplicate
  - [ ] Webhook log created for duplicate attempt
  - [ ] Original transaction unchanged
  - [ ] No new transaction created

### Transaction Endpoints

#### GET /api/transactions - List All

- [ ] **Default request (no filters)**
  - [ ] Returns 200 status code
  - [ ] Returns data array
  - [ ] Returns pagination object
  - [ ] Default page = 1
  - [ ] Default limit = 50
  - [ ] Default sort = created_at DESC
  - [ ] Pagination.total matches actual count
  - [ ] Pagination.totalPages calculated correctly

#### GET /api/transactions - Filtering

- [ ] **Filter by source**
  - [ ] Returns only matching source transactions
  - [ ] Empty results when no matches
  - [ ] Case-sensitive matching works

- [ ] **Filter by status**
  - [ ] Returns only matching status transactions
  - [ ] All valid statuses work as filters
  - [ ] Empty results when no matches

- [ ] **Filter by merchant_id**
  - [ ] Returns only transactions for that merchant
  - [ ] Valid UUID format required
  - [ ] Empty results when no matches

- [ ] **Filter by date_from**
  - [ ] Returns transactions >= date_from
  - [ ] ISO 8601 format required
  - [ ] Timezone handling correct

- [ ] **Filter by date_to**
  - [ ] Returns transactions <= date_to
  - [ ] ISO 8601 format required
  - [ ] Timezone handling correct

- [ ] **Multiple filters combined**
  - [ ] AND logic applied correctly
  - [ ] All filters work together
  - [ ] Empty results handled correctly

#### GET /api/transactions - Pagination

- [ ] **page parameter**
  - [ ] Page 1 returns first N results
  - [ ] Page 2 returns next N results
  - [ ] Page navigation works correctly
  - [ ] Rejects page < 1
  - [ ] Rejects page = 0

- [ ] **limit parameter**
  - [ ] Custom limit applies correctly
  - [ ] Rejects limit < 1
  - [ ] Rejects limit = 0
  - [ ] Rejects limit > 1000
  - [ ] Default limit = 50 when not specified

#### GET /api/transactions - Sorting

- [ ] **sort_by parameter**
  - [ ] created_at sorting works
  - [ ] amount sorting works
  - [ ] status sorting works
  - [ ] Invalid sort_by rejected or defaults to created_at

- [ ] **sort_order parameter**
  - [ ] asc order works correctly
  - [ ] desc order works correctly
  - [ ] Default is desc when not specified

#### GET /api/transactions/:id - Get Single

- [ ] **Valid transaction ID**
  - [ ] Returns 200 status code
  - [ ] Returns complete transaction data
  - [ ] All fields present and correct types
  - [ ] JSONB payload properly formatted

- [ ] **Invalid transaction ID**
  - [ ] Returns 400 for non-UUID format
  - [ ] Returns 404 for non-existent UUID
  - [ ] Error messages are clear

### Analytics Endpoints

#### GET /api/analytics/summary - All Data

- [ ] **No filters**
  - [ ] Returns 200 status code
  - [ ] Returns totalVolume (number)
  - [ ] Returns totalTransactions (number)
  - [ ] Returns countByStatus (object with all statuses)
  - [ ] Returns topSources (array, max 5)
  - [ ] Returns averageTransactionAmount (number)
  - [ ] Returns successRate (percentage)
  - [ ] All calculations correct

- [ ] **countByStatus object**
  - [ ] Contains pending count
  - [ ] Contains processing count
  - [ ] Contains completed count
  - [ ] Contains failed count
  - [ ] Contains refunded count
  - [ ] Contains cancelled count
  - [ ] All values are numbers >= 0

- [ ] **topSources array**
  - [ ] Max 5 sources returned
  - [ ] Sorted by count DESC
  - [ ] Each source has: source, count, volume

#### GET /api/analytics/summary - Filtering

- [ ] **Filter by merchant_id**
  - [ ] Returns analytics for specific merchant only
  - [ ] Valid UUID required

- [ ] **Filter by date range**
  - [ ] date_from filter works
  - [ ] date_to filter works
  - [ ] Both filters work together
  - [ ] ISO 8601 format required

- [ ] **Filter by currency**
  - [ ] Returns analytics for specific currency only
  - [ ] 3-letter uppercase required
  - [ ] Rejects lowercase currency

- [ ] **Invalid filters**
  - [ ] Rejects invalid merchant_id format
  - [ ] Rejects invalid date format
  - [ ] Rejects invalid currency format
  - [ ] Returns 400 with validation errors

---

## Frontend Testing

### Application Setup

- [ ] **App initialization**
  - [ ] App loads without errors
  - [ ] No console errors on load
  - [ ] React Query client configured
  - [ ] Router configured correctly
  - [ ] Default route redirects to /transactions

### Layout Component

- [ ] **Header/Navigation**
  - [ ] Logo/title displays correctly
  - [ ] Navigation links present
  - [ ] Transactions link works
  - [ ] Analytics link works
  - [ ] Active route highlighted
  - [ ] Responsive on mobile
  - [ ] Responsive on tablet
  - [ ] Responsive on desktop

- [ ] **Main content area**
  - [ ] Content renders in proper container
  - [ ] Proper spacing/padding
  - [ ] Scrolling works correctly

### Transactions List Page

#### Page Load & Layout

- [ ] **Initial load**
  - [ ] Page renders without errors
  - [ ] Skeleton loader shows while loading
  - [ ] Data loads and displays
  - [ ] Loading state transitions smoothly
  - [ ] No console errors

- [ ] **Filter bar**
  - [ ] Filter section displays correctly
  - [ ] All filter inputs present
  - [ ] Source dropdown populated
  - [ ] Status dropdown populated
  - [ ] Date inputs functional
  - [ ] Clear Filters button present

#### Transaction Table

- [ ] **Table structure**
  - [ ] Table headers display correctly
  - [ ] Column headers: ID, Source, Amount, Status, Date
  - [ ] Table is scrollable horizontally on mobile
  - [ ] Rows are clickable
  - [ ] Hover state visible on rows

- [ ] **Data display**
  - [ ] Transaction IDs truncated correctly (first 8 chars)
  - [ ] Source names capitalized
  - [ ] Amounts formatted with currency symbol
  - [ ] Status badges colored correctly:
    - [ ] pending = yellow
    - [ ] processing = blue
    - [ ] completed = green
    - [ ] failed = red
    - [ ] refunded = purple
    - [ ] cancelled = gray
  - [ ] Dates formatted correctly (human-readable)

#### Filtering Functionality

- [ ] **Source filter**
  - [ ] Dropdown changes filter state
  - [ ] "All Sources" option works
  - [ ] Individual sources filter correctly
  - [ ] Resets page to 1 on change

- [ ] **Status filter**
  - [ ] Dropdown changes filter state
  - [ ] "All Statuses" option works
  - [ ] Individual statuses filter correctly
  - [ ] Resets page to 1 on change

- [ ] **Date filters**
  - [ ] Date From picker works
  - [ ] Date To picker works
  - [ ] Date range filtering works
  - [ ] Resets page to 1 on change

- [ ] **Clear Filters button**
  - [ ] Resets all filters to default
  - [ ] Resets page to 1
  - [ ] Re-fetches data

- [ ] **Multiple filters**
  - [ ] All filters work together
  - [ ] Results update correctly
  - [ ] Empty state shown when no results

#### Pagination

- [ ] **Pagination controls**
  - [ ] Page info displays correctly
  - [ ] Previous button present
  - [ ] Next button present
  - [ ] Page number buttons present
  - [ ] Total count displayed

- [ ] **Navigation**
  - [ ] Previous button disabled on page 1
  - [ ] Next button disabled on last page
  - [ ] Page numbers clickable
  - [ ] Current page highlighted
  - [ ] Navigation updates URL (if applicable)
  - [ ] Data updates on page change

#### Transaction Detail Modal

- [ ] **Modal trigger**
  - [ ] Clicking row opens modal
  - [ ] Modal appears smoothly
  - [ ] Overlay darkens background

- [ ] **Modal content**
  - [ ] Transaction ID displayed in full
  - [ ] All transaction fields shown
  - [ ] Source displayed
  - [ ] Merchant ID displayed
  - [ ] Amount with currency displayed
  - [ ] Status displayed with badge
  - [ ] Created date displayed
  - [ ] Updated date displayed
  - [ ] Payload/metadata displayed (if present)
  - [ ] Close button present

- [ ] **Modal interaction**
  - [ ] Close button closes modal
  - [ ] Clicking overlay closes modal
  - [ ] ESC key closes modal (if implemented)
  - [ ] Modal closes smoothly

#### Loading & Error States

- [ ] **Loading state**
  - [ ] Skeleton loader shows initially
  - [ ] Skeleton matches table structure
  - [ ] Smooth transition to data

- [ ] **Error state**
  - [ ] Error message displays if fetch fails
  - [ ] Error message is user-friendly
  - [ ] Retry button present (if implemented)
  - [ ] Retry button works

- [ ] **Empty state**
  - [ ] Message shown when no transactions
  - [ ] Message is helpful
  - [ ] Suggests next action

### Analytics Dashboard Page

#### Page Load & Layout

- [ ] **Initial load**
  - [ ] Page renders without errors
  - [ ] Skeleton loaders show while loading
  - [ ] Data loads and displays
  - [ ] No console errors

- [ ] **Summary cards**
  - [ ] 4 summary cards display
  - [ ] Cards arranged in grid (responsive)
  - [ ] Cards have proper spacing

#### Summary Cards

- [ ] **Total Volume card**
  - [ ] Title: "Total Volume"
  - [ ] Value formatted as currency
  - [ ] Icon displays correctly
  - [ ] Subtitle text correct
  - [ ] Card styling correct (green theme)

- [ ] **Total Transactions card**
  - [ ] Title: "Total Transactions"
  - [ ] Value formatted with commas
  - [ ] Icon displays correctly
  - [ ] Subtitle text correct
  - [ ] Card styling correct (blue theme)

- [ ] **Average Amount card**
  - [ ] Title: "Average Amount"
  - [ ] Value formatted as currency
  - [ ] Icon displays correctly
  - [ ] Subtitle text correct
  - [ ] Card styling correct (purple theme)

- [ ] **Success Rate card**
  - [ ] Title: "Success Rate"
  - [ ] Value shows percentage with 2 decimals
  - [ ] Icon displays correctly
  - [ ] Subtitle text correct
  - [ ] Card styling correct (yellow theme)

#### Charts

- [ ] **Status Breakdown Donut Chart**
  - [ ] Chart renders without errors
  - [ ] Title: "Transactions by Status"
  - [ ] Donut shape correct
  - [ ] All statuses represented
  - [ ] Colors match status badges
  - [ ] Labels show status and percentage
  - [ ] Tooltip shows on hover
  - [ ] Legend displays below chart
  - [ ] Legend colors match slices

- [ ] **Top Sources Bar Chart**
  - [ ] Chart renders without errors
  - [ ] Title: "Top Sources by Count"
  - [ ] Bars display correctly
  - [ ] X-axis shows source names
  - [ ] Y-axis shows counts
  - [ ] Grid lines visible
  - [ ] Tooltip shows on hover
  - [ ] Legend displays
  - [ ] Bar color is blue

- [ ] **Volume Over Time Line Chart**
  - [ ] Chart renders without errors
  - [ ] Title: "Volume Over Time"
  - [ ] Line chart displays
  - [ ] Two lines: Volume and Count
  - [ ] Dual Y-axes (left for volume, right for count)
  - [ ] X-axis shows dates
  - [ ] Grid lines visible
  - [ ] Tooltip shows formatted values
  - [ ] Legend displays
  - [ ] Lines colored correctly (green for volume, blue for count)
  - [ ] Data points visible

#### Responsive Design

- [ ] **Desktop (>1024px)**
  - [ ] 4 cards in single row
  - [ ] Charts in 2-column layout
  - [ ] All content visible
  - [ ] No horizontal scroll

- [ ] **Tablet (768px - 1024px)**
  - [ ] Cards reflow appropriately
  - [ ] Charts stack or resize
  - [ ] Content readable
  - [ ] Navigation accessible

- [ ] **Mobile (<768px)**
  - [ ] Cards stack vertically
  - [ ] Charts resize to fit
  - [ ] Text sizes appropriate
  - [ ] Touch targets large enough
  - [ ] Horizontal scroll for tables only

#### Loading & Error States

- [ ] **Loading state**
  - [ ] Skeleton loaders for cards
  - [ ] Skeleton loaders for charts
  - [ ] Smooth transition to data

- [ ] **Error state**
  - [ ] Error message displays if fetch fails
  - [ ] Error message is user-friendly
  - [ ] Retry option present (if implemented)

### Cross-Browser Testing

- [ ] **Chrome**
  - [ ] Layout correct
  - [ ] All features work
  - [ ] No console errors

- [ ] **Firefox**
  - [ ] Layout correct
  - [ ] All features work
  - [ ] No console errors

- [ ] **Safari**
  - [ ] Layout correct
  - [ ] All features work
  - [ ] No console errors

- [ ] **Edge**
  - [ ] Layout correct
  - [ ] All features work
  - [ ] No console errors

### Accessibility

- [ ] **Keyboard navigation**
  - [ ] Tab order logical
  - [ ] All interactive elements focusable
  - [ ] Focus indicators visible
  - [ ] Enter/Space activate buttons

- [ ] **Screen reader**
  - [ ] Alt text on images/icons
  - [ ] ARIA labels where needed
  - [ ] Form labels associated correctly
  - [ ] Error messages announced

- [ ] **Color contrast**
  - [ ] Text readable on backgrounds
  - [ ] Status badges have sufficient contrast
  - [ ] Links distinguishable

### Performance

- [ ] **Initial load time**
  - [ ] Page loads in < 3 seconds
  - [ ] No blocking resources
  - [ ] Assets optimized

- [ ] **Runtime performance**
  - [ ] No lag when filtering
  - [ ] Smooth scrolling
  - [ ] Charts render quickly
  - [ ] No memory leaks

---

## Integration Testing

### End-to-End Workflows

- [ ] **Complete webhook flow**
  - [ ] Webhook received → validation → DB insert → log created → response returned
  - [ ] Data visible in frontend immediately (after refresh)
  - [ ] Analytics update correctly

- [ ] **User journey: View transactions**
  - [ ] Navigate to Transactions page
  - [ ] See list of transactions
  - [ ] Click transaction to view details
  - [ ] Close modal
  - [ ] Filter transactions
  - [ ] Navigate pages

- [ ] **User journey: View analytics**
  - [ ] Navigate to Analytics page
  - [ ] See summary cards with data
  - [ ] See all charts rendered
  - [ ] Charts interactive (tooltips, hover)

### API Integration

- [ ] **Frontend calls backend correctly**
  - [ ] API base URL configured correctly
  - [ ] CORS enabled on backend
  - [ ] Request headers correct
  - [ ] Response parsing works

- [ ] **Error handling**
  - [ ] Network errors caught and displayed
  - [ ] 400 errors show validation messages
  - [ ] 404 errors show not found messages
  - [ ] 500 errors show generic error

---

## Database Testing

### Schema Validation

- [ ] **Constraints enforced**
  - [ ] UUID primary keys generated
  - [ ] NOT NULL constraints work
  - [ ] CHECK constraints work (amount >= 0)
  - [ ] Foreign keys cascade correctly
  - [ ] UNIQUE constraints work (via unique index on payload)

- [ ] **Indexes exist**
  - [ ] Merchant + status index
  - [ ] Source index
  - [ ] Created_at index
  - [ ] JSONB GIN index

### Data Integrity

- [ ] **Transactions table**
  - [ ] All fields stored correctly
  - [ ] JSONB payload valid
  - [ ] Timestamps auto-updated
  - [ ] Currency uppercase enforced
  - [ ] Status lowercase enforced

- [ ] **Webhook logs table**
  - [ ] All fields stored correctly
  - [ ] Request/response payloads stored as JSONB
  - [ ] Processing time recorded
  - [ ] Error messages stored
  - [ ] Nullable transaction_id works

---

## Security Testing

- [ ] **Input validation**
  - [ ] SQL injection prevented (parameterized queries)
  - [ ] XSS prevented (React auto-escapes)
  - [ ] Invalid JSON rejected
  - [ ] Oversized payloads rejected

- [ ] **CORS configuration**
  - [ ] CORS headers present
  - [ ] Allowed origins configured
  - [ ] Preflight requests work

- [ ] **Environment variables**
  - [ ] .env file not committed to git
  - [ ] Sensitive data not exposed in responses
  - [ ] Database credentials secure

---

## Documentation Testing

- [ ] **README exists**
  - [ ] Setup instructions clear
  - [ ] Dependencies listed
  - [ ] Run commands documented

- [ ] **API documentation**
  - [ ] Endpoints documented
  - [ ] Request/response examples provided
  - [ ] Error codes documented

- [ ] **Code comments**
  - [ ] JSDoc comments on exported functions
  - [ ] Complex logic explained
  - [ ] AI-generated lines logged

---

## Test Results Summary

**Total Checklist Items:** 370
**Items Passed:** _To be filled during manual testing_
**Items Failed:** _To be filled during manual testing_
**Items Blocked:** _To be filled during manual testing_
**Items Not Applicable:** _To be filled during manual testing_

**Test Coverage:** _To be calculated after testing_

---

## Notes

- This checklist should be executed with backend running and connected to a test database
- Frontend should be running in development mode
- Some items require actual API calls and database inspection
- Mock data is currently used in frontend - switch to live API for full testing
- Performance metrics may vary based on hardware and network conditions

---

## Sign-off

**QA Engineer:** _________________________
**Date:** _________________________
**Status:** [ ] APPROVED [ ] REJECTED [ ] NEEDS REVISION
