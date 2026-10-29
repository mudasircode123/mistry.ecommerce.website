# MASTER DEVELOPMENT PROMPT — FORME E-COMMERCE PLATFORM

## 1. Your Role and Mission

Act as a senior full-stack software engineer, e-commerce architect, UI/UX designer, database engineer, security specialist, and AI integration developer.

Build a complete, production-oriented e-commerce platform for clothing and shoes, targeting customers exclusively in Pakistan.

The temporary brand name is **FORME**. Keep the brand name configurable so it can be changed later without modifying the entire codebase.

This must be a real, functional application, not a static mockup, landing-page-only project, or collection of disconnected UI components.

Implement the frontend, backend, database schema, authentication, admin dashboard, shopping cart, checkout, order processing, Google Sheets integration, AI shopping assistant, notifications, and integration settings.

First inspect the current workspace. If it is empty, initialize a fresh Next.js project. If files already exist, inspect them before modifying anything.

Do not stop after producing a plan. Implement the application in organized phases, run available checks, fix errors, and document any remaining setup that genuinely requires external credentials or merchant approval.

Do not invent working integrations, pretend payments have succeeded, or display fake business data as real production data.

---

## 2. Required Technology Stack

Use the following architecture:

- **Framework:** Next.js with App Router.
- **Language:** TypeScript with strict typing.
- **Frontend:** React, Tailwind CSS, and accessible reusable UI components.
- **Database:** Supabase PostgreSQL.
- **Authentication:** Supabase Auth.
- **File storage:** Supabase Storage.
- **AI provider:** Groq API.
- **AI model:** `qwen/qwen3.8-27b`, configurable through `GROQ_MODEL`.
- **Order reporting:** Google Sheets API.
- **Validation:** A TypeScript-compatible validation library such as Zod.
- **Icons:** Lucide React.
- **Testing:** Appropriate unit, integration, and end-to-end tests.

Use secure server-side Next.js Route Handlers or Server Actions where appropriate. Keep business rules, authentication checks, privileged database access, payment verification, and integration secrets on the server.

Use current stable dependency versions compatible with the environment. Avoid unnecessary dependencies and do not introduce an additional backend framework unless a specific requirement justifies it.

---

## 3. Brand Identity and Approved Visual Direction

The website must combine premium fashion, modern streetwear, and a sophisticated international e-commerce experience.

The approved reference is the original premium fashion layout with a black announcement bar, warm off-white surfaces, a large fashion hero image, a curated product grid, and the clothing-image discount popup.

Do not replace this direction with a generic template or an excessively stripped-down design.

### Typography

Use this font stack consistently:

`"Helvetica Neue", Helvetica, Arial, sans-serif`

Use Helvetica where available and fall back gracefully when it is not installed.

Headings should have confident editorial hierarchy. Body text must be readable. Buttons, product labels, navigation, prices, and form controls must use consistent font weights and sizing.

### Color palette

Use a restrained premium palette:

- Primary black: `#171717`
- Warm ivory: `#F4F1EB`
- White: `#FFFFFF`
- Secondary text: `#6B665F`
- Neutral borders: `#D8D4CD`
- Muted beige sections: `#E8E4DD`

Use colors consistently rather than introducing unrelated gradients, neon colors, or excessive visual effects.

### Design principles

- High-quality editorial fashion and sneaker photography.
- Carefully aligned content and consistent spacing.
- Premium navigation and understated interactions.
- Strong product imagery and attractive product cards.
- Subtle transitions rather than distracting animation.
- Clear prices, product variants, stock information, and calls to action.
- Excellent mobile, tablet, and desktop layouts.
- Accessible contrast, keyboard navigation, visible focus states, and meaningful labels.

The finished website should feel designed by an experienced fashion e-commerce team. Avoid generic AI-generated layouts, repetitive oversized cards, excessive rounded containers, unnecessary animations, placeholder text, and broken images.

Use appropriately licensed or otherwise permitted image assets. Provide graceful image fallbacks and keep product imagery easy to replace through the admin dashboard.

---

## 4. Homepage and Promotional Experience

Build a complete homepage containing:

1. A narrow announcement bar for promotions or shipping information.
2. A responsive header with the FORME logo, search, account, wishlist, and shopping bag.
3. Navigation for New Arrivals, Clothing, Sneakers, and Accessories.
4. A large editorial fashion hero image and compelling headline.
5. Clear shopping buttons for the main collections.
6. Featured collections and new arrivals.
7. Best-selling or trending product sections.
8. Category-based shopping sections.
9. A promotional campaign section.
10. Trust information covering delivery, payment options, and applicable return policies.
11. A professional footer containing policies, contact information, and social links.

Only publish claims that the store can actually fulfil. For example, do not promise free delivery or instant refunds unless the corresponding rules are configured.

All navigation links and shopping buttons must lead to actual pages or functional actions.

### Mandatory first-visit discount popup

Create an attractive promotional popup displayed when a visitor first enters the public storefront.

The popup must include:

- A high-quality clothing or fashion-model image.
- A headline such as “A Little Welcome Gift”.
- A prominent “10% OFF YOUR FIRST ORDER” offer.
- A sample coupon code: `WELCOME10`.
- A short promotional message.
- A “Copy Discount Code” button.
- A “Shop Now” or equivalent shopping action.
- A visible close control.
- A “No Thanks, Continue Shopping” option.

Show the popup approximately 1–2 seconds after the visitor arrives, with appropriate mobile positioning and a subtle entrance animation.

Do not show it repeatedly during every navigation event. Persist its dismissal or display status in browser storage, handle server-rendering safely, and allow the visitor to continue browsing without interacting with it.

Do not show this promotional popup on the admin login, checkout, or other sensitive account flows.

The discount must be a real, server-validated coupon rather than a visual claim. Create an initial configurable coupon record or provide a documented activation step. The administrator must be able to enable, disable, or change the coupon.

Do not apply the discount twice or allow customers to manipulate the discount amount from the browser.

---

## 5. Customer Storefront and Product Catalog

Implement the complete shopping experience.

### Product catalog

Customers must be able to:

- Browse all products.
- Browse categories and collections.
- Search products by name and relevant keywords.
- Filter by category, size, color, price, availability, and other relevant attributes.
- Sort by price, newest arrivals, and popularity where supported by actual data.
- View product details and related products.

### Product detail page

Every product should support:

- Product name and description.
- Main image and an image gallery.
- Price in PKR.
- Optional sale price and discount information.
- Category and SKU.
- Available sizes and colors.
- Size guide where relevant.
- Variant-specific stock information.
- Quantity selection.
- Add to Cart.
- Add to Wishlist.
- Availability information.
- Delivery and return policy links.

A product must not be purchasable in a size or color that is unavailable.

### Inventory and supplier management

The business will use a hybrid inventory model: some products will be held in the store's own stock, while others will be sourced from suppliers.

Represent the sourcing method explicitly in the database.

For own-stock products, maintain actual variant-level quantities.

For supplier-sourced products, record supplier details, availability or stock information, and lead-time information when provided. Do not invent a supplier's availability.

Revalidate inventory on the server when an order is placed. Use database transactions or suitable atomic operations to prevent overselling and ensure inventory changes cannot be duplicated.

### Cart and wishlist

Implement:

- Add, remove, and update cart items.
- Quantity validation.
- Variant and size selection.
- Cart subtotal and order summary.
- Coupon entry and validation.
- Persistent guest cart.
- Customer wishlist.
- Appropriate cart handling when a guest logs in.

Never trust prices or totals supplied by the browser. Recalculate prices, discounts, delivery fees, and totals using trusted server-side data.

---

## 6. Customer Accounts and Authentication

Implement the following authentication options:

- Create an account with email and password.
- Login and logout.
- Email verification.
- Forgot password and password reset.
- Google sign-in.
- Facebook sign-in.
- Secure session handling.

**Do not add TikTok login.**

Use Supabase Auth rather than implementing custom password storage or authentication from scratch.

Guest checkout must be supported alongside registered-customer checkout.

Customers with accounts should be able to manage their profile, saved addresses, order history, and order details. Provide order tracking and the appropriate cancellation or return-request functionality according to the store's configured policies.

For guests, provide a secure way to access their order confirmation and tracking information without exposing personal data through guessable order IDs.

The Google and Facebook OAuth buttons must use actual OAuth flows when configured. If credentials are missing, show an appropriate setup message instead of pretending the login succeeded.

Document the required provider configuration, callback URLs, and redirect settings.

---

## 7. Secure, Admin-Only Dashboard

Create a professional admin dashboard with a distinct interface for managing the business.

Suggested route: `/admin`

Include:

### Dashboard overview

Display real database-backed information:

- Total orders.
- Revenue based on the store's defined payment and reporting rules.
- Pending orders.
- Orders awaiting shipment.
- Low-stock products.
- Recent orders.
- Top-selling products where data is available.
- Recent notifications and integration errors.

Clearly distinguish demo or seeded data from actual business data.

### Product management

Administrators should be able to:

- Create, edit, archive, and delete products where appropriate.
- Upload and manage product images.
- Manage categories.
- Manage sizes, colors, SKUs, and variant-level inventory.
- Configure sale prices and product visibility.
- Identify own-stock and supplier-sourced products.

### Order management

Provide:

- Order search and filters.
- Customer and delivery information.
- Order items, sizes, colors, and quantities.
- Order status and payment status.
- Internal order notes.
- Shipping and tracking details.
- Cancellation and return handling according to configured rules.

### Other admin sections

Include:

- Inventory management.
- Supplier management.
- Customer management with appropriate privacy protections.
- Coupon management.
- Sales and inventory reports.
- Notification settings.
- Payment and shipping configuration.
- Google Sheets sync status.
- Audit logs for important administrative actions.

### Strict authorization requirements

Public customers must never be able to register themselves as administrators.

Assign the initial administrator through a secure, documented setup procedure that requires trusted operator action.

Enforce admin access on the server and at the database-policy level. Protecting only the admin page's appearance or hiding navigation links is insufficient.

Use trusted server-verified role information. Never trust a role supplied by a client request, browser storage, or user-editable metadata.

Apply appropriate Supabase Row Level Security policies so customers cannot read or modify other customers' private data.

A normal customer must not be able to access admin APIs by changing a URL or calling an endpoint directly.

Do not expose the Supabase service-role key, OAuth secrets, payment secrets, Google credentials, or Groq API key to frontend code.

Implement basic login rate limiting, input validation, secure session handling, security headers where appropriate, and safe error responses.

No system can promise absolute security; use layered defenses and document the security assumptions.

---

## 8. Database Schema and Supabase Integration

Create a well-organized Supabase schema with appropriate foreign keys, indexes, constraints, timestamps, and migration files.

Include tables or equivalent structures for:

- Profiles and authorization roles.
- Categories.
- Products.
- Product images.
- Product variants and inventory.
- Suppliers.
- Customer addresses.
- Wishlists.
- Orders.
- Order items.
- Payment records.
- Coupons and coupon usage.
- Notifications.
- Audit logs.
- Google Sheets sync jobs or an equivalent reliable outbox.

Adapt the final schema to avoid unnecessary duplication and preserve relational integrity.

### Order model

Each order must have a unique order identifier and record:

- Order date.
- Customer ID when authenticated.
- Customer name.
- Phone number.
- Email where provided.
- Delivery address, city, and relevant delivery details.
- Product and variant snapshots.
- Quantity.
- Subtotal.
- Discount.
- Delivery fee.
- Final amount in PKR.
- Payment method.
- Payment status.
- Order status.
- Shipping information when available.

Preserve order-item snapshots so later product price or title changes do not rewrite historical orders.

Use precise monetary storage, preferably integer amounts in paisa, with consistent conversion and formatting for PKR.

Provide SQL migrations and seed data. Add appropriate RLS policies to every exposed table that requires them. Do not rely on frontend restrictions for data security.

Use Supabase Storage policies for product images and any private customer uploads.

Do not store passwords, complete card numbers, CVVs, or other unnecessary payment credentials in application tables.

---

## 9. Checkout and Pakistani Payment Methods

The website serves Pakistan only.

Use English as the interface language and PKR as the default currency. Support Pakistani delivery addresses and phone numbers.

Implement:

### Cash on Delivery

Customers should be able to select COD and place orders. Record the correct pending-payment state and order status.

Do not mark a COD order as paid merely because it was created.

### Online payments

Prepare an extensible server-side payment integration layer for verified, supported payment providers.

Evaluate suitable official options, including Bank Alfalah, Meezan Bank, and compatible payment gateways that support the merchant's actual requirements.

NayaPay, SadaPay, and other supported wallet or bank-transfer methods can be included according to available official integration capabilities and the merchant's setup.

Do not invent gateway endpoints, credentials, SDK functionality, or successful payment responses.

Where an official gateway is configured, implement the appropriate payment initiation, server-side verification, signed webhook handling, amount and currency checks, and duplicate-event protection.

Where direct integration is unavailable, a clearly labelled bank-transfer or wallet-transfer workflow may be provided using administrator-configured instructions. Such payments must remain pending until verified through an approved process.

The admin must be able to mark a manually verified transfer as paid, with an audit record.

Never treat a customer-uploaded receipt or a browser success message as sufficient proof of payment.

Never store sensitive card data yourself.

If merchant credentials are not available, build the configurable integration interface, explain the required setup, and keep the unavailable gateway disabled. Do not describe it as fully operational.

---

## 10. Courier Integration and Delivery Management

Build a shipping abstraction that can accommodate a supported Pakistani courier API.

Support:

- Configurable delivery fees.
- Shipment creation when supported.
- Courier tracking numbers.
- Tracking links or status details.
- Shipment and delivery status updates.
- Admin visibility into failed shipment operations.
- A manual shipment fallback.

The specific courier and merchant account have not yet been selected. Therefore, do not hardcode imaginary APIs or claim live automation without valid provider credentials and documentation.

Build a clean provider-adapter interface so a verified courier can be integrated later without rewriting checkout or order-management logic.

Validate and authenticate any inbound courier status webhooks according to the provider's documented security requirements.

---

## 11. AI Shopping Assistant — Groq + Qwen

Integrate a customer-facing AI shopping assistant using the official Groq API.

Use:

`GROQ_MODEL=qwen/qwen3.8-27b`

Keep the model identifier configurable through the environment. If this Preview model becomes unavailable or changes, the administrator or developer should be able to configure a supported replacement without rewriting the integration.

### Chatbot capabilities

The assistant should:

- Answer product questions.
- Recommend relevant clothing and shoes.
- Search for products using customer requirements.
- Check real prices and variant-level availability.
- Explain sizes and product specifications from actual catalog data.
- Explain configured delivery, returns, exchanges, and payment policies.
- Help customers understand how to track their orders.
- Direct unresolved questions to customer support.

### Real data retrieval

Do not make the model the source of truth for product information.

Provide secure server-side functions for retrieving product information, availability, policy information, and—when authorized—an individual customer's order status.

The assistant may only state prices, sizes, stock, and order information supported by verified application data.

If information is unavailable, the assistant must say so instead of inventing it.

Customers may only retrieve their own private order information. A guest may access tracking only through a suitably verified guest-order access mechanism.

Do not let chatbot instructions bypass authorization or call arbitrary database operations.

Protect the AI endpoint with rate limiting, appropriate request validation, bounded message history, error handling, and safeguards against prompt injection.

Use a server-side `GROQ_API_KEY`. Never expose it to the browser.

Build an attractive, responsive chat widget with loading states, readable conversation history, graceful API errors, and product recommendation cards linked to actual product pages.

---

## 12. Google Sheets — Automatically Record New Orders

Every newly created order must be recorded automatically in a designated Google spreadsheet.

Supabase remains the primary database. Google Sheets is a secondary reporting destination.

### Required spreadsheet columns

Create or document these columns:

1. Order ID.
2. Order date and time.
3. Customer name.
4. Customer phone.
5. Customer email, when provided.
6. City.
7. Delivery address.
8. Product names.
9. Product variants, sizes, and colors.
10. Quantities.
11. Product subtotal.
12. Discount.
13. Delivery fee.
14. Final order amount in PKR.
15. Payment method.
16. Payment status at order creation.
17. Order status at order creation.

Represent multiple products consistently, such as serialized JSON or a predictable readable format within the relevant cells.

### Synchronization requirements

When an order has been successfully created in the database:

- Trigger synchronization to Google Sheets through a trusted server-side process.
- Append a row for the new order.
- Do not update the spreadsheet record later when payment, courier, or order status changes; the requested scope is new-order reporting only.
- Do not append the same order twice.
- Use the unique order ID as an idempotency key, and check existing spreadsheet records before retrying an uncertain append.
- Record integration errors and allow a controlled retry through the admin system.
- Keep the order intact in Supabase if Google Sheets is unavailable.
- Never expose Google credentials in frontend code.

Use an appropriate Google Sheets API authentication method and document spreadsheet sharing permissions and required configuration.

Restrict spreadsheet access because it contains private customer information.

Provide a configurable spreadsheet ID and document the required environment variables.

---

## 13. Customer and Admin Notifications

Implement three notification channels.

### Website notifications

Provide customer account notifications and admin dashboard notifications for relevant events.

Where appropriate, use Supabase Realtime or another suitable mechanism for live updates, with server-side permissions controlling who receives each notification.

### Email notifications

Prepare a configurable email integration for:

- Order confirmation.
- Payment status.
- Shipment dispatch.
- Delivery status.
- Account-related messages where appropriate.

Use an established email provider through a documented server-side adapter. If the provider is not configured, report that clearly instead of pretending the email was delivered.

### WhatsApp Business

Prepare the official WhatsApp Business Platform or Cloud API integration.

Support approved message templates and customer consent requirements where applicable.

Configure customer and admin notification recipients securely.

Do not send unauthorized messages, assume that a number has consented, or claim that a message was delivered without a successful provider response.

### Reliability

Record relevant delivery results and failures. Use controlled retries where appropriate, and prevent duplicate notifications when processing the same event more than once.

Notify the customer and admin according to the event's relevance. Do not expose confidential information unnecessarily in message previews.

---

## 14. Seed Products and Demo Mode

Include realistic, clearly labelled sample products for initial development and demonstration.

Seed a varied catalog of clothing and shoes with categories, descriptions, images or reliable fallbacks, prices in PKR, size and color variants, and sample inventory.

Create initial data that makes it possible to demonstrate:

- Homepage and product browsing.
- Search and filters.
- Product-detail selection.
- Cart and coupon functionality.
- Guest and authenticated checkout flows.
- Admin product and inventory management.
- Orders and reporting.
- AI recommendations based on seeded catalog data.

Make it easy to replace, edit, archive, or remove demo data through the admin dashboard.

Clearly separate demo setup from production launch. Do not present test orders, sample analytics, or unverified supplier data as real business activity.

---

## 15. Performance, SEO, Accessibility, and Quality

Implement:

- Responsive layouts across common screen sizes.
- Correct image sizing and optimization.
- Fast page rendering and sensible loading states.
- Search-friendly page titles and metadata.
- Product metadata and structured data where appropriate.
- Accessible keyboard navigation and form validation.
- Empty states and useful error messages.
- Not-found pages.
- Safe failure handling for external integrations.
- Proper environment configuration.
- Reusable components and consistent code conventions.

Avoid unnecessary client-side JavaScript and excessive database queries.

Do not log API keys, passwords, full access tokens, payment secrets, or sensitive personal information.

---

## 16. Required Project Structure and Documentation

Use a maintainable project structure with clear separation between:

- Storefront pages and components.
- Admin pages and components.
- Authentication utilities.
- Supabase browser and server clients.
- Database migrations and seed scripts.
- Domain/business logic.
- Payment adapters.
- Courier adapters.
- Groq/chatbot integration.
- Google Sheets integration.
- Email and WhatsApp integrations.
- Validation schemas.
- Automated tests.

Create:

- An `.env.example` containing variable names and safe placeholders only.
- Supabase migration files.
- A seed script for demo products and initial configuration.
- A README containing installation and setup instructions.
- A deployment guide.
- An integration setup guide.
- A security and production-readiness checklist.

Document environment variables for at least the necessary Supabase URL and keys, Groq API key and model, Google Sheets access, optional email provider, WhatsApp Business, payment gateways, and courier providers.

Never write real secrets into source code, commit them to version control, or place server-only secrets in `NEXT_PUBLIC_*` variables.

Use an administrative setup procedure that does not require an unsafe public admin-registration mechanism.

---

## 17. Testing and Definition of Done

Do not consider the project complete merely because the homepage looks good.

Run the available lint, type-check, production build, and tests. Fix the errors that you can resolve in the workspace.

Create or run tests for important flows, including:

- Product browsing and product variants.
- Cart calculations.
- Coupon validation and discount application.
- Guest checkout.
- Registered-customer checkout.
- Server-side order and inventory validation.
- Duplicate order-submission protection.
- Admin authorization.
- Customer data isolation.
- Payment webhook verification.
- Google Sheets duplicate-prevention and failure handling.
- AI catalog-data accuracy and authorization.
- Notification error handling.

Where external credentials prevent full integration testing, provide explicit instructions for testing in the corresponding provider dashboard or sandbox. Never treat a mocked response as evidence that a live integration works.

### Final acceptance criteria

The project should have:

1. A polished premium fashion + streetwear storefront.
2. The approved clothing-image welcome discount popup.
3. Working product listing, search, variants, cart, and wishlist.
4. Guest checkout and customer accounts.
5. Secure admin-only operations.
6. Supabase-backed products, inventory, customers, and orders.
7. COD and appropriately configured online-payment options.
8. A configurable courier integration layer.
9. A Groq-powered chatbot using the configured Qwen model.
10. Automatic Google Sheets reporting for new orders only.
11. Website, email, and WhatsApp notification integrations.
12. Useful demo data and a maintainable codebase.
13. Clear external-service configuration instructions.
14. Passing available project checks, with remaining blockers explicitly documented.

When you finish, provide a concise implementation report stating what was built, what was tested, which integrations are operational, which still require credentials or merchant approvals, and the exact steps to run the application locally.

**Build the actual application in the current workspace. Prioritize correctness, security, maintainability, and a polished customer experience over superficial visual effects.**


RESPONSIVE DESIGN REQUIREMENT:
Make every page and component fully responsive across mobile phones, tablets,
laptops, and desktop PCs. Use mobile-first design, appropriate breakpoints,
responsive product grids, adaptive navigation, and touch-friendly controls.
Ensure the admin dashboard, charts, tables, forms, chatbot, checkout, and
discount popup work correctly on small screens without horizontal overflow.
Test layouts at 360px, 390px, 768px, 1024px, 1366px, and 1920px widths.
Fix all responsive layout issues before declaring the project complete.
