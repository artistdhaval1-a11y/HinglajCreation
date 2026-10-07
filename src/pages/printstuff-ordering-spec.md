# PrintStuff Custom Ordering Website

## Customer portal
- Product catalogue: Zipper Hoodie 320 GSM, Regular Hoodie 320 GSM, Normal Polo 180 GSM, Premium Polo 220 GSM, Crew Neck T-Shirt 180 GSM, Cap.
- Quantity-tier pricing must match the supplied B2B catalogue.
- Product customizer: garment colour, size, quantity, logo/artwork upload, notes.
- Cart and quotation/order review.
- Customer checkout with name, phone/WhatsApp, email, billing/shipping address.
- Order confirmation with unique PrintStuff order ID.
- Customer order-tracking page using order ID + phone/email verification.

## Admin portal
- Secure admin login.
- Dashboard: total orders, active orders, sales value, customers.
- Order table with search/filter.
- Order detail: customer info, items, artwork files, notes, payment, shipping.
- Status workflow: Order Received -> Artwork Review -> Production -> Printing -> Quality Check -> Dispatched -> Delivered.
- Admin can update status and add internal/customer-facing notes.
- Artwork approval/revision flow.
- Export orders to CSV.

## Backend
Recommended: Next.js/TypeScript + PostgreSQL on Render.
Tables: admins, customers, products, product_variants, orders, order_items, artwork_files, order_status_history, addresses, payments, shipments.
Store artwork in object storage and keep file URLs/metadata in PostgreSQL.
Send status notifications by WhatsApp/email through configurable providers.

## Source catalogue
The website specification is based on the supplied 7-page PrintStuff B2B catalogue. It states shipping is extra on all orders. Sizes for apparel are S, M, L, XL, XXL, while the cap is universal free size.
