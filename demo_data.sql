-- BeautyFlow Demo Data Script
-- Run this in your Supabase SQL Editor to populate your clinic with sample data for your LinkedIn video!

-- 1. Create a Demo Clinic (if you don't have one yet)
INSERT INTO public.clinics (id, name) 
VALUES ('d0000000-0000-0000-0000-000000000000', 'Lumina Aesthetic & Spa')
ON CONFLICT (id) DO NOTHING;

-- 2. Create Service Categories
INSERT INTO public.service_categories (id, clinic_id, name)
VALUES 
  ('c1111111-1111-1111-1111-111111111111', 'd0000000-0000-0000-0000-000000000000', 'Facial Treatments'),
  ('c2222222-2222-2222-2222-222222222222', 'd0000000-0000-0000-0000-000000000000', 'Body Sculpting')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Services
INSERT INTO public.services (id, clinic_id, category_id, name, duration, requires_room, is_active)
VALUES 
  ('s1111111-1111-1111-1111-111111111111', 'd0000000-0000-0000-0000-000000000000', 'c1111111-1111-1111-1111-111111111111', 'HydraFacial Glow', 60, true, true),
  ('s2222222-2222-2222-2222-222222222222', 'd0000000-0000-0000-0000-000000000000', 'c1111111-1111-1111-1111-111111111111', 'Chemical Peel', 45, true, true),
  ('s3333333-3333-3333-3333-333333333333', 'd0000000-0000-0000-0000-000000000000', 'c2222222-2222-2222-2222-222222222222', 'Cryolipolysis', 90, true, true)
ON CONFLICT (id) DO NOTHING;

-- 4. Create Employees
INSERT INTO public.employees (id, clinic_id, name)
VALUES 
  ('e1111111-1111-1111-1111-111111111111', 'd0000000-0000-0000-0000-000000000000', 'Dr. Helena Silveira'),
  ('e2222222-2222-2222-2222-222222222222', 'd0000000-0000-0000-0000-000000000000', 'Marcus Aesthetician')
ON CONFLICT (id) DO NOTHING;

-- 5. Create Clients
INSERT INTO public.clients (id, clinic_id, name, email, phone)
VALUES 
  ('cl111111-1111-1111-1111-111111111111', 'd0000000-0000-0000-0000-000000000000', 'Alice Johnson', 'alice@example.com', '+5511988887777'),
  ('cl222222-2222-2222-2222-222222222222', 'd0000000-0000-0000-0000-000000000000', 'Bob Smith', 'bob@example.com', '+5511977776666')
ON CONFLICT (id) DO NOTHING;

-- 6. Create Rooms
INSERT INTO public.rooms (id, clinic_id, name, type)
VALUES 
  ('r1111111-1111-1111-1111-111111111111', 'd0000000-0000-0000-0000-000000000000', 'Zen Suite', 'room'),
  ('r2222222-2222-2222-2222-222222222222', 'd0000000-0000-0000-0000-000000000000', 'Station A', 'station')
ON CONFLICT (id) DO NOTHING;

-- 7. Create Appointments
INSERT INTO public.appointments (clinic_id, client_id, employee_id, service_id, start_time, end_time, status, notes)
VALUES 
  ('d0000000-0000-0000-0000-000000000000', 'cl111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', NOW() + INTERVAL '1 hour', NOW() + INTERVAL '2 hours', 'scheduled', 'First time customer'),
  ('d0000000-0000-0000-0000-000000000000', 'cl222222-2222-2222-2222-222222222222', 'e2222222-2222-2222-2222-222222222222', 's3333333-3333-3333-3333-333333333333', NOW() + INTERVAL '3 hours', NOW() + INTERVAL '4.5 hours', 'scheduled', 'Prefers cold water');
