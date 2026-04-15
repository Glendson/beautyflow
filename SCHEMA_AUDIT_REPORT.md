## SCHEMA AUDIT - Schema Drift Analysis
**Date**: 2026-04-15
**Project**: BeautyFlow
**Supabase Project**: epkkwyrebbsyeougwswd

### REAL DATABASE SCHEMA (from Supabase)

#### appointments
- id (uuid, NOT NULL) ✓
- clinic_id (uuid, YES) ✓
- client_id (uuid, YES) ✓
- employee_id (uuid, YES) ✓
- room_id (uuid, YES) ✓
- service_id (uuid, YES) ✓
- start_time (timestamp, NOT NULL) ✓
- end_time (timestamp, NOT NULL) ✓
- status (text, YES) ✓
- created_at (timestamp, YES) ✓
- **notes (text, YES)** ← MISSING in code

#### clinics
- id (uuid, NOT NULL) ✓
- name (text, NOT NULL) ✓
- created_at (timestamp, YES) ✓
- slug (text, YES) ✓
**MISSING expected columns**: email, phone, address, working_hours_start, working_hours_end, logo_url, updated_at

#### clients
- id (uuid) ✓
- clinic_id (uuid) ✓
- name (text) ✓
- phone (text) ✓
- email (text) ✓

#### employees
- id (uuid) ✓
- clinic_id (uuid) ✓
- name (text) ✓

#### rooms
- id (uuid) ✓
- clinic_id (uuid) ✓
- name (text) ✓
- type (text, optional) ✓

#### services
- id (uuid) ✓
- clinic_id (uuid) ✓
- category_id (uuid, optional) ✓
- name (text) ✓
- duration (integer) - NOT duration_minutes ← MISMATCH
- requires_room (boolean) ✓
- requires_specialist (boolean) ✓
- is_active (boolean) ✓

#### employee_services (junction)
- employee_id (uuid) ✓
- service_id (uuid) ✓

#### service_categories
- id (uuid) ✓
- clinic_id (uuid) ✓
- name (text) ✓

---

### SCHEMA DRIFT FOUND

#### ❌ CRITICAL ISSUES
1. **AppointmentRepository**: Selects `updated_at` which DOESN'T EXIST in DB
2. **Appointment Domain**: Has `updated_at` field not in database
3. **Service Domain**: Has `duration_minutes` but DB has `duration` (integer minutes)
4. **Clinic**: Missing fields in real DB that code expects (email, phone, address, working_hours_*, logo_url, updated_at)

#### ✅ SAFE (Won't cause errors)
- Appointments missing `notes` field in code (nullable in DB)
- Migrations reference columns that don't exist yet

---

### FIXES REQUIRED

#### Fix 1: Update AppointmentRepository select
- REMOVE: updated_at
- ADD: notes
- New select: `id,clinic_id,client_id,service_id,employee_id,room_id,start_time,end_time,status,created_at,notes`

#### Fix 2: Update DBAppointment interface
- Remove: updated_at?: Date
- Add: notes?: string

#### Fix 3: Update Appointment domain entity
- Remove: updated_at?: Date
- Add: notes?: string

#### Fix 4: Update Service domain
- Change: duration_minutes → duration (it's just integer minutes in DB)

#### Fix 5: Fix ClinicRepository
- Remove: updated_at, email, phone, address, working_hours_start, working_hours_end, logo_url
- Keep: id, name, slug, created_at
- Select should be: `id,name,slug,created_at` (wildcard select OK for single record)

#### Fix 6: Update DBClinic interface
- Remove: email, phone, address, working_hours_start, working_hours_end, logo_url, updated_at
- Current fields align with DB

#### Fix 7: Remove all wildcard select(*)
- Use explicit column selection everywhere
