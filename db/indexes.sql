-- =============================================================================
-- OceanCatch — Performance Indexes
-- These are managed by Prisma via @@index() in schema.prisma.
-- This file documents the indexes for reference and manual inspection.
-- =============================================================================

-- Product table
-- Already created by Prisma db push:
--   Product_inStock_idx
--   Product_category_idx
--   Product_inStock_category_idx
--   Product_createdAt_idx
--   Product_deletedAt_idx
--   Product_featured_idx

-- To verify indexes exist:
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'Product'
ORDER BY indexname;

-- Order table
--   Order_status_idx
--   Order_createdAt_idx
--   Order_customerPhone_idx

-- ContactMessage table
--   ContactMessage_isRead_idx
--   ContactMessage_createdAt_idx

-- AuditLog table
--   AuditLog_entity_entityId_idx
--   AuditLog_createdAt_idx
