-- Additional indexes for Dashboard Performance Optimization (Phase 2)
-- Created: 2026-04-14
-- Purpose: Further optimize dashboard queries with composite indexes for filtering and sorting

-- Composite index for appointments: clinic + status + start_time (for dashboard metrics)
CREATE INDEX IF NOT EXISTS idx_appointments_clinic_status_start_time 
  ON public.appointments(clinic_id, status, start_time DESC);

-- Composite index for services: clinic + is_active + name (for service list filtering)
CREATE INDEX IF NOT EXISTS idx_services_clinic_active_name 
  ON public.services(clinic_id, is_active, name);

-- Composite index for clients: clinic + name (for client list search)
CREATE INDEX IF NOT EXISTS idx_clients_clinic_name 
  ON public.clients(clinic_id, name);

-- Composite index for employees: clinic + name (for employee list search)
CREATE INDEX IF NOT EXISTS idx_employees_clinic_name 
  ON public.employees(clinic_id, name);

-- Composite index for rooms: clinic + type + name (for room filtering)
CREATE INDEX IF NOT EXISTS idx_rooms_clinic_type_name 
  ON public.rooms(clinic_id, type, name);

-- Analyze indexes after creation for query planner
ANALYZE public.appointments;
ANALYZE public.services;
ANALYZE public.clients;
ANALYZE public.employees;
ANALYZE public.rooms;
