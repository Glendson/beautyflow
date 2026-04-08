-- Add missing columns for public booking feature

-- Add description and phone columns to clinics
ALTER TABLE public.clinics
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS working_hours_start TIME,
ADD COLUMN IF NOT EXISTS working_hours_end TIME,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add description to services
ALTER TABLE public.services
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add specialty to employees
ALTER TABLE public.employees
ADD COLUMN IF NOT EXISTS specialty TEXT;

-- Add capacity to rooms
ALTER TABLE public.rooms
ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 1;
