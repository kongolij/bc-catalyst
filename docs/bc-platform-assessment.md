# BigCommerce Platform Assessment
## Proposed Enhancements — Pricing & B2B Architecture

**Date:** May 2026  
**Prepared by:** Engineering Team  
**Status:** Proposal for Review

---

## Executive Summary

This document outlines two targeted proposals to improve the BigCommerce platform implementation. Both proposals align with the existing headless Catalyst storefront architecture and are intended to reduce external dependencies, simplify the data model, and lay the groundwork for future scalability. All other areas of the platform — Shows, Booths, product data model (including modifiers), and the setup wizard / ordering product flow — are working well and are recommended to remain unchanged.

---

## 1. Migrate Real-Time Pricing from Azure Database to BigCommerce Price Lists

### Current State

Product prices are currently fetched in real time from an external Azure SQL database at the point of display and checkout. This requires a live database call on every price lookup, introduces a dependency on an external system in the critical path of the shopping experience, and requires custom middleware to bridge the Azure database with the storefront.

### Proposed Change

Move product pricing into BigCommerce natively using **Price Lists** and **Customer Groups**, as already proven through the Shows feature implementation. Prices are loaded into BC via the Management REST API (`PUT /v3/pricelists/{id}/records`) and applied automatically by BC's commerce engine when a customer belonging to the relevant group views or purchases a product.

The ERP integration pipeline described in the integration architecture document (Azure Service Bus → Subscriber Functions) will handle keeping BC Price Lists up to date as prices change in source ERP systems.

### Benefits

- **Eliminates real-time external dependency at checkout.** Pricing is resolved entirely within BigCommerce's commerce engine. No external database call is made during product display, add-to-cart, or checkout.

- **Reduces latency and improves storefront performance.** BC's internal price resolution is faster and more reliable than a live Azure DB query, particularly under load.

- **Simplifies the architecture.** The custom pricing middleware layer between the storefront and Azure database is no longer needed. This reduces the number of systems involved in a single page render.

- **Native multi-currency support.** Price List records support multiple currencies per product natively, removing the need for custom currency conversion logic.

- **Supports show-specific and segment-specific pricing.** The Price List + Customer Group model supports any pricing segment — shows, dealer tiers, regional pricing — using the same BC-native mechanism, with no code changes to the storefront.

- **Prices are auditable and manageable in BC Admin.** Marketing and operations teams can review and override prices directly in the BC control panel without needing database access.

- **Reduces Azure DB read load and infrastructure cost.** Eliminating real-time pricing queries reduces database request volume and associated compute costs.

- **Already validated by the Shows feature.** The Price List and Customer Group mechanism is live and working in production for show-specific pricing. This proposal extends the same pattern to the full product catalog.

---

## 2. Enable BigCommerce B2B Edition — Migrate Companies into BigCommerce

### Current State

The system operates on a B2B business model but is currently managed as a B2C implementation. When an end user creates an account, the system queries an external system to look up their company affiliation. Companies are not represented as entities within BigCommerce itself. As a result, customer-to-company relationships are managed outside of BC, there is no native company search within the BC ecosystem, and future B2B capabilities require custom development rather than leveraging platform features.

### Proposed Change

Enable **BigCommerce B2B Edition** and migrate company records into BigCommerce as first-class entities. Customers will be linked to their companies natively within BC. The external company lookup on account creation will be replaced by BC's native company-customer association.

This is an additive change. The current storefront implementation (Catalyst, custom routes, authentication flow) is not modified. B2B Edition layers on top of the existing setup.

### Benefits

- **Companies become first-class entities in BigCommerce.** Each company has its own record in BC, including contact details, associated customers, and pricing assignments. This makes company data visible and manageable directly in the BC Admin.

- **Native company search replaces external system lookup.** Sales reps and administrators can search, view, and manage companies without querying an external system. Account creation and company assignment becomes self-contained within BC.

- **Customers are logically linked to companies within BC.** The customer-to-company relationship is stored and enforced natively. This enables proper account hierarchy — a customer belongs to a company, and the company drives pricing, permissions, and terms.

- **Unlocks future B2B out-of-the-box features without custom development.** Once B2B Edition is active and companies are in BC, the following capabilities become available as platform features rather than custom builds:
  - Shared shopping lists (per company)
  - Quote management and approval workflows
  - Net payment terms (Net 30, Net 60)
  - Company-level credit limits
  - Buyer role management within a company

- **Reduces reliance on the external system for account management.** The external system remains the system of record for ERP data, but it no longer needs to be queried in real time during the customer registration flow.

- **Does not compromise or break the current implementation.** B2B Edition is additive. Existing routes, authentication (NextAuth), custom account pages, Shows functionality, and the Catalyst storefront continue to work as-is. The migration is a data and configuration exercise, not a code rewrite.

- **Positions the platform for scalable B2B growth.** As the business evolves, the B2B feature set can be expanded by enabling platform capabilities rather than building custom solutions. The investment in proper company data structure pays dividends over time.

---

## 3. Areas Recommended to Remain Unchanged

The following areas of the platform are working effectively and are **not proposed for change** at this time.

### Shows & Booths

The current implementation of show-specific pricing (customer group assignment + price list lookup via the `/account/shows/` route) is live and functioning. The mechanism is well-suited to the use case and requires no changes. Booth management will also remain on the current approach.

### Product Data Model (including Modifiers)

The existing product structure, including product options and modifiers configured in BigCommerce, is working correctly and does not require migration or restructuring. Any changes here carry a high risk of disrupting existing product pages and the checkout flow.

### Setup Wizard and Ordering Product Flow

The current setup wizard and product ordering flow is a custom implementation that has been designed around specific business requirements. It is recommended to retain this approach as a stable, known-good implementation rather than introducing platform changes in this area.

---

## 4. Summary

| Area | Recommendation | Rationale |
|---|---|---|
| Pricing (Azure DB → BC Price Lists) | **Proceed** | Removes real-time dependency, improves performance, already proven via Shows |
| B2B Edition + Companies in BC | **Proceed** | Additive, unlocks native B2B features, improves company-customer data model |
| Shows & Booths | Keep current | Working, no changes needed |
| Product data model + modifiers | Keep current | Stable, changes carry high risk |
| Setup wizard / ordering product | Keep current | Custom implementation fits business requirements |

Both proposals are low-risk relative to the improvements they deliver. They are independent of each other and can be executed sequentially or in parallel depending on resource availability.

---

*End of document*
