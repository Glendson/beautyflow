-- Add Critical Indexes for BeautyFlow Performance
-- Created: 2026-03-21
-- Purpose: Optimize query performance for clinic_id filtering, date ranges, and foreign keys

-- Index on appointments for clinic_id filtering
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_id 
  ON public.appointments(clinic_id);

-- Composite index for date range queries
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_start_time 
  ON public.appointments(clinic_id, start_time);

-- Index for employee overlap detection
CREATE INDEX IF NOT EXISTS idx_appointments_employee_start_time 
  ON public.appointments(employee_id, start_time, end_time);

-- Indexes for clinic_id on all main entities
CREATE INDEX IF NOT EXISTS idx_clients_clinic_id 
  ON public.clients(clinic_id);

CREATE INDEX IF NOT EXISTS idx_services_clinic_id 
  ON public.services(clinic_id);

CREATE INDEX IF NOT EXISTS idx_employees_clinic_id 
  ON public.employees(clinic_id);

CREATE INDEX IF NOT EXISTS idx_rooms_clinic_id 
  ON public.rooms(clinic_id);

CREATE INDEX IF NOT EXISTS idx_service_categories_clinic_id 
  ON public.service_categories(clinic_id);

-- Index for employee-services junction table
CREATE INDEX IF NOT EXISTS idx_employee_services_employee_id 
  ON public.employee_services(employee_id);

CREATE INDEX IF NOT EXISTS idx_employee_services_service_id 
  ON public.employee_services(service_id);

-- Indexes for foreign keys (if not auto-created)
CREATE INDEX IF NOT EXISTS idx_appointments_service_id 
  ON public.appointments(service_id);

CREATE INDEX IF NOT EXISTS idx_appointments_employee_id 
  ON public.appointments(employee_id);

CREATE INDEX IF NOT EXISTS idx_appointments_client_id 
  ON public.appointments(client_id);

CREATE INDEX IF NOT EXISTS idx_appointments_room_id 
  ON public.appointments(room_id);

CREATE INDEX IF NOT EXISTS idx_services_category_id 
  ON public.services(category_id);

-- Create statistics for query optimizer
ANALYZE public.appointments;
ANALYZE public.clients;
ANALYZE public.services;
ANALYZE public.employees;
ANALYZE public.rooms;
ANALYZE public.service_categories;
ANALYZE public.employee_services;

-- Verify indexes were created
-- SELECT * FROM pg_indexes WHERE table_name IN ('appointments', 'clients', 'services', 'employees', 'rooms');
