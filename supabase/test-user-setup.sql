-- ⚠️ MANUAL SETUP SCRIPT
-- Execute this in Supabase Dashboard → SQL Editor → New Query
-- This bypasses email confirmation and creates a test user directly

-- Step 1: Insert auth user directly (ONLY FOR TESTING)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  confirmation_token,
  recovery_token,
  email_change_token,
  phone_change_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'qa-test@example.com',
  crypt('TestPassword123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Step 2: Get the user_id we just created
WITH inserted_user AS (
  SELECT id FROM auth.users WHERE email = 'qa-test@example.com'
)

-- Step 3: Create clinic for this user
INSERT INTO public.clinics (name, slug)
SELECT 'QA Test Clinic', 'qa-test-' || substring(inserted_user.id::text, 1, 8)
FROM inserted_user
ON CONFLICT (slug) DO NOTHING
RETURNING id;

-- Step 4: Link user to clinic
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'qa-test@example.com'
),
clinic_data AS (
  SELECT id FROM public.clinics WHERE slug LIKE 'qa-test-%'
)
INSERT INTO public.user_profiles (id, clinic_id, first_name, last_name, role)
SELECT user_data.id, clinic_data.id, 'QA', 'Tester', 'admin'
FROM user_data, clinic_data
ON CONFLICT (id) DO UPDATE SET clinic_id = EXCLUDED.clinic_id;

-- Result: User created with:
-- Email: qa-test@example.com
-- Password: TestPassword123!
-- Status: Email already confirmed ✅
-- Clinic: Created automatically ✅

-- Test this works in your app:
-- 1. Try login with qa-test@example.com / TestPassword123!
-- 2. Should redirect to dashboard immediately (no email confirm needed)
