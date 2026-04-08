# Database Migration Guide

This document explains how to create, test, and apply database migrations in BeautyFlow.

## Overview

BeautyFlow uses **Supabase Migrations** to version-control database schema changes. This ensures:
- ✅ All developers have identical database schemas
- ✅ Production deployments are reproducible
- ✅ Changes are auditable and reversible
- ✅ Multi-tenancy (RLS policies) is enforced consistently

**Golden Rule:** Never execute SQL directly in the Supabase Dashboard. Always create a migration.

## Migration Lifecycle

```
Create migration file → Test locally → Commit → Deploy to production
```

## Step-by-Step: Creating a Migration

### 1. Create the Migration File

Create a new file in `/supabase/migrations/` with this naming convention:

```
YYYYMMDDHHMMSS_descriptive_name.sql
```

**Examples:**
- `20260408120000_add_billing_table.sql`
- `20260408120100_add_rls_policies_clinics.sql`
- `20260408120200_add_performance_indexes.sql`

**Tip:** Use `date +%s` or an online converter to generate the timestamp.

### 2. Write the Migration

Use this template:

```sql
-- /supabase/migrations/20260408120000_my_feature.sql

-- ============================================================================
-- Migration: Add [Feature/Table Name]
-- Date: 2026-04-08
-- Author: [Your Name]
-- Description: [What this migration does and why]
-- ============================================================================

-- Step 1: Create table(s)
CREATE TABLE IF NOT EXISTS public.my_entity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 2: Create indexes (for performance)
CREATE INDEX idx_my_entity_clinic_id ON public.my_entity(clinic_id);

-- Step 3: Enable RLS
ALTER TABLE public.my_entity ENABLE ROW LEVEL SECURITY;

-- Step 4: Add RLS policies
CREATE POLICY "tenant_isolation" ON public.my_entity
  FOR ALL
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid()));

-- Step 5: Grant permissions (if needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON public.my_entity TO authenticated;
```

### 3. Checklist Before Committing

- [ ] File named correctly: `YYYYMMDDHHMMSS_feature_name.sql`
- [ ] Migration includes CREATE TABLE / ALTER TABLE / etc.
- [ ] RLS is **enabled** on the table: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- [ ] RLS **policies** are created (clinic isolation)
- [ ] Indexes created for frequently queried columns (`clinic_id`, date ranges)
- [ ] Foreign key constraints use `ON DELETE CASCADE`
- [ ] Comments explain the purpose
- [ ] No DROP statements (unless reverting; if so, coordinate with team)

### 4. Test Locally

Before committing, validate the migration syntax:

```bash
npm run db:push --dry-run
```

**Expected output:**
```
✓ Database is up to date
-- OR --
✓ Applying migration YYYYMMDDHHMMSS_descriptive_name.sql
```

If errors appear, fix the SQL and retry.

### 5. Apply the Migration

Once validated, apply it:

```bash
npm run db:push
```

### 6. Generate TypeScript Types

After the migration is applied, regenerate TypeScript types:

```bash
npm run db:types
```

This updates `src/lib/types/database.types.ts` with the new table/columns.

### 7. Commit

Commit the migration file (NOT the generated types, already .gitignored):

```bash
git add supabase/migrations/YYYYMMDDHHMMSS_*.sql
git commit -m "chore: add [entity] table and RLS policies"
```

## Common Patterns

### Pattern 1: New Entity (CRUD)

```sql
-- Create table with clinic isolation
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  invoice_number VARCHAR NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR DEFAULT 'draft', -- draft | sent | paid | overdue
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(clinic_id, invoice_number)
);

-- Index for clinic-scoped queries
CREATE INDEX idx_invoices_clinic_id ON public.invoices(clinic_id);

-- Index for status/date filtering
CREATE INDEX idx_invoices_clinic_status ON public.invoices(clinic_id, status);

-- Enable RLS
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Isolation by clinic
CREATE POLICY "clinic_isolation" ON public.invoices
  FOR ALL
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid()));
```

### Pattern 2: Add Column to Existing Table

```sql
-- Add a new column
ALTER TABLE public.clients
ADD COLUMN IF NOT EXISTS birthdate DATE,
ADD COLUMN IF NOT EXISTS preferred_contact_method VARCHAR DEFAULT 'email';

-- Add index if needed
CREATE INDEX idx_clients_birthdate ON public.clients(clinic_id, birthdate);

-- No RLS changes needed (table already has policies)
```

### Pattern 3: Add RLS Policy to Existing Table

```sql
-- For employees: allow viewing only if clinic matches
CREATE POLICY "admin_can_manage_employees" ON public.employees
  FOR ALL
  USING (
    clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid())
  )
  WITH CHECK (
    clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid())
  );
```

### Pattern 4: Create Junction Table (M2M)

```sql
-- Create junction table for many-to-many relationship
CREATE TABLE IF NOT EXISTS public.employee_services (
  employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
  PRIMARY KEY (employee_id, service_id)
);

-- Index for reverse lookups
CREATE INDEX idx_employee_services_service_id ON public.employee_services(service_id);

-- RLS: check via employee → clinic relationship
ALTER TABLE public.employee_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_isolation" ON public.employee_services
  FOR ALL
  USING (
    employee_id IN (
      SELECT id FROM public.employees 
      WHERE clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid())
    )
  );
```

## Troubleshooting

### Error: "Migration already applied"
The migration was previously applied. Create a **new migration** (with a new timestamp) that fixes the issue.

### Error: "Invalid SQL syntax"
Review the SQL for typos. Use the dry-run:
```bash
npm run db:push --dry-run
```

### Error: "Column already exists"
Use `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` instead of `ADD COLUMN`.

### Want to reset local database?

**Caution:** This deletes all local data!

```bash
npm run db:reset
```

This reruns all migrations from scratch.

### Want to see migration history?

Check logged applied migrations:
```bash
supabase migration list
```

## Best Practices

1. **One migration per logical change** — don't combine unrelated changes
2. **Always test locally** — use `--dry-run` before applying
3. **Include comments** — explain the "why" in the migration
4. **Atomic commits** — commit only the migration file, not generated types
5. **Multi-tenancy first** — every table must have RLS policies
6. **Index strategically** — add indexes for `clinic_id` + frequently filtered columns
7. **Use IF NOT EXISTS / IF EXISTS** — migrations must be idempotent in some cases
8. **Review with team** — discuss schema changes before applying to production

## Quick Reference

```bash
# Create and test
echo "CREATE TABLE ..." > supabase/migrations/YYYYMMDDHHMMSS_name.sql
npm run db:push --dry-run

# Apply
npm run db:push

# Generate types
npm run db:types

# Check history
supabase migration list

# Reset (dev only!)
npm run db:reset
```

---

**Need help?** Refer to the [Supabase Migrations Docs](https://supabase.com/docs/guides/migrations).
