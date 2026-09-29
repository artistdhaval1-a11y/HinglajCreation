import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.DATABASE_URL?.includes("sslmode=require") ? { rejectUnauthorized: false } : undefined,
});


let schemaReady: Promise<void> | null = null;

export function db() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not configured");
  return pool;
}

export function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db().query(
        "CREATE TABLE IF NOT EXISTS orders (" +
        "id BIGSERIAL PRIMARY KEY, order_code TEXT UNIQUE NOT NULL, " +
        "customer_name TEXT NOT NULL, customer_phone TEXT NOT NULL, " +
        "shipping_address TEXT NOT NULL, shipping_city TEXT NOT NULL, shipping_state TEXT NOT NULL, shipping_pincode TEXT NOT NULL, " +
        "colour TEXT NOT NULL, size TEXT NOT NULL, patch_details TEXT NOT NULL DEFAULT 'None', patch_price INTEGER NOT NULL DEFAULT 0, " +
        "print_details TEXT NOT NULL DEFAULT 'None', print_price INTEGER NOT NULL DEFAULT 0, total INTEGER NOT NULL, " +
        "patch_uploaded BOOLEAN NOT NULL DEFAULT FALSE, print_uploaded BOOLEAN NOT NULL DEFAULT FALSE, " +
        "status TEXT NOT NULL DEFAULT 'Order Received', courier_name TEXT, tracking_number TEXT, tracking_url TEXT, " +
        "created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW());" +
        "CREATE INDEX IF NOT EXISTS orders_phone_idx ON orders(customer_phone);" +
        "CREATE INDEX IF NOT EXISTS orders_created_idx ON orders(created_at DESC);"
      );
      await db().query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]'::jsonb");
    })().catch(error => { schemaReady = null; throw error; });
  }
  return schemaReady;
}
