-- =============================================================================
-- OceanCatch — Row Level Security (RLS) Policies
-- Run this file once on your Neon database via the Neon SQL Editor or psql.
-- =============================================================================

-- ─── Step 1: Create application roles ────────────────────────────────────────
-- "anon"  — unauthenticated public (storefront visitors)
-- "admin" — authenticated admin operations

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    CREATE ROLE anon NOLOGIN;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'app_admin') THEN
    CREATE ROLE app_admin NOLOGIN;
  END IF;
END $$;

-- Grant connect to the neondb_owner user (already has superuser)
-- These grants let the connection pool impersonate roles via SET LOCAL ROLE

-- ─── Step 2: Enable RLS on all tables ────────────────────────────────────────

ALTER TABLE "Product"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Order"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "OrderItem"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContactMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SiteSettings"   ENABLE ROW LEVEL SECURITY;

-- ─── Step 3: Product policies ────────────────────────────────────────────────

-- Public can only see active (non-deleted), in-stock products
DROP POLICY IF EXISTS "public_read_active_products" ON "Product";
CREATE POLICY "public_read_active_products"
  ON "Product" FOR SELECT
  TO anon
  USING ("deletedAt" IS NULL);

-- Admin can read everything including soft-deleted
DROP POLICY IF EXISTS "admin_all_products" ON "Product";
CREATE POLICY "admin_all_products"
  ON "Product" FOR ALL
  TO app_admin
  USING (true)
  WITH CHECK (true);

-- ─── Step 4: Order policies ───────────────────────────────────────────────────

-- Public cannot read orders directly
DROP POLICY IF EXISTS "admin_all_orders" ON "Order";
CREATE POLICY "admin_all_orders"
  ON "Order" FOR ALL
  TO app_admin
  USING (true)
  WITH CHECK (true);

-- ─── Step 5: OrderItem policies ───────────────────────────────────────────────

DROP POLICY IF EXISTS "admin_all_order_items" ON "OrderItem";
CREATE POLICY "admin_all_order_items"
  ON "OrderItem" FOR ALL
  TO app_admin
  USING (true)
  WITH CHECK (true);

-- ─── Step 6: ContactMessage policies ─────────────────────────────────────────

-- Public can INSERT (submit contact form) but not read
DROP POLICY IF EXISTS "public_insert_contact" ON "ContactMessage";
CREATE POLICY "public_insert_contact"
  ON "ContactMessage" FOR INSERT
  TO anon
  WITH CHECK (true);

DROP POLICY IF EXISTS "admin_all_contact" ON "ContactMessage";
CREATE POLICY "admin_all_contact"
  ON "ContactMessage" FOR ALL
  TO app_admin
  USING (true)
  WITH CHECK (true);

-- ─── Step 7: AuditLog policies ───────────────────────────────────────────────

-- Only admin can read audit logs; no one can update/delete them
DROP POLICY IF EXISTS "admin_read_audit" ON "AuditLog";
CREATE POLICY "admin_read_audit"
  ON "AuditLog" FOR SELECT
  TO app_admin
  USING (true);

-- System (via service role / neondb_owner) can insert
DROP POLICY IF EXISTS "system_insert_audit" ON "AuditLog";
CREATE POLICY "system_insert_audit"
  ON "AuditLog" FOR INSERT
  TO app_admin
  WITH CHECK (true);

-- ─── Step 8: SiteSettings policies ───────────────────────────────────────────

-- Public can read site settings (phone, email)
DROP POLICY IF EXISTS "public_read_settings" ON "SiteSettings";
CREATE POLICY "public_read_settings"
  ON "SiteSettings" FOR SELECT
  TO anon
  USING (true);

DROP POLICY IF EXISTS "admin_all_settings" ON "SiteSettings";
CREATE POLICY "admin_all_settings"
  ON "SiteSettings" FOR ALL
  TO app_admin
  USING (true)
  WITH CHECK (true);

-- ─── Step 9: Grant table permissions to roles ─────────────────────────────────

GRANT SELECT                          ON "Product"        TO anon;
GRANT SELECT, INSERT                  ON "ContactMessage" TO anon;
GRANT SELECT                          ON "SiteSettings"   TO anon;

GRANT ALL                             ON "Product"        TO app_admin;
GRANT ALL                             ON "Order"          TO app_admin;
GRANT ALL                             ON "OrderItem"      TO app_admin;
GRANT ALL                             ON "ContactMessage" TO app_admin;
GRANT ALL                             ON "AuditLog"       TO app_admin;
GRANT ALL                             ON "SiteSettings"   TO app_admin;

-- ─── Done ─────────────────────────────────────────────────────────────────────
-- To apply: paste this file into the Neon SQL Editor at console.neon.tech
-- or run: psql $DIRECT_URL -f db/rls.sql
