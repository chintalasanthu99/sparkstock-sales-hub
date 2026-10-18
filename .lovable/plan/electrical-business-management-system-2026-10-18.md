# Electrical Business Management System

## Product outcome
Build a responsive, secure electrical wholesale and retail operations system—not a marketing page—with an empty-by-default dashboard that becomes useful as real business records are entered. Use a dark, precise distribution-workbench visual style with clear tables, compact summaries, Indian rupee/date conventions, and useful mobile layouts.

## Delivery plan
1. Enable Lovable Cloud and establish authenticated access, role-aware navigation, relational business records, and audit-friendly stock/financial workflows.
2. Implement the operating core: dashboard, products and stock history, suppliers/customers, purchase orders and goods receipts, POS/invoices, payments, expenses, returns, and adjustments. Use real persistent records and validated forms; no fabricated live data.
3. Add inventory intelligence and finance: explainable movement/aging classifications, reorder recommendations awaiting approval, profitability/cash/receivable/payable views, and date-filtered reports.
4. Add alerts, action tracking, role restrictions, export/print workflows, and responsive empty/loading/error states. Deliver supported real workflows first; clearly surface any integrations that need external configuration.
5. Verify the core purchase → goods received → stock → completed sale → payment/profit path, business calculations, routing, and the current preview.

## Technical approach
- Keep the existing TanStack Start application and build the working management experience at `/`.
- Use Lovable Cloud for authentication and persistent relational records; follow the platform's server-runtime, schema-grant, role, and server-function guidance before adding backend code.
- Treat stock movements as traceable, referenced events; receiving goods and completing a sale must affect stock exactly once, and a purchase order alone must not add stock.
- Validate user inputs at the UI and trusted server boundary, and use authorized roles for restricted financial or stock-adjustment actions.
- Keep business calculations testable and reports based on saved records; show empty states rather than sample business data.
