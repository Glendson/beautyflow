/**
 * QUERY EXECUTION PLAN DOCUMENTATION
 * BeautyFlow Backend Performance Optimization - Phase 2
 * 
 * This document outlines the query execution patterns and optimization strategies
 * implemented to achieve sub-500ms response times for dashboard queries.
 */

// =============================================================================
// 1. APPOINTMENT REPOSITORY QUERIES
// =============================================================================

/**
 * Query: findById(id, clinicId)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,client_id,service_id,employee_id,room_id,start_time,end_time,status,created_at,updated_at
 * - FROM appointments
 * - WHERE id = $1 AND clinic_id = $2
 * 
 * Indexes Used:
 * - Primary Key Index (id) [unique lookup]
 * - idx_appointments_clinic_id [clinic_id filter]
 * 
 * Expected Performance:
 * - Index Scan with 1-2 page lookups
 * - Response time: < 5ms
 * - No N+1 risk: returns single record
 */

/**
 * Query: findAll(clinicId)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,client_id,service_id,employee_id,room_id,start_time,end_time,status,created_at,updated_at
 * - FROM appointments
 * - WHERE clinic_id = $1
 * - ORDER BY start_time ASC
 * 
 * Indexes Used:
 * - idx_appointments_clinic_id [clinic_id = filter]
 * - idx_appointments_clinic_start_time [start_time ordering]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 50ms for 1000 appointments
 * - WARNING: Returns ALL appointments - use findAllPaginated for dashboard
 */

/**
 * Query: findAllPaginated(clinicId, page, pageSize, filters, dateRange)
 * 
 * Execution Plan (Dashboard Usage - with date range):
 * - SELECT COUNT(id) FROM appointments
 *   WHERE clinic_id = $1 AND status = $2 
 *   AND start_time >= $3 AND start_time < $4
 * 
 * - SELECT id,clinic_id,client_id,service_id,employee_id,room_id,start_time,end_time,status,created_at,updated_at
 *   FROM appointments
 *   WHERE clinic_id = $1 AND status = $2 
 *   AND start_time >= $3 AND start_time < $4
 *   ORDER BY start_time DESC
 *   LIMIT $5 OFFSET $6
 * 
 * Indexes Used:
 * - idx_appointments_clinic_status_start_time [composite: clinic_id, status, start_time]
 * 
 * Expected Performance:
 * - Index Range Scan (bounded by date range)
 * - Rows scanned: ~500-1000 (vs all appointments)
 * - Response time: < 50ms for 10,000 total appointments
 * - Pagination: 20-30 records per page
 * 
 * CRITICAL: Date range is MANDATORY for dashboard performance
 * Without date range, this query scans ALL appointments (full table scan risk)
 */

/**
 * Query: findByDateRange(clinicId, start, end)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,client_id,service_id,employee_id,room_id,start_time,end_time,status,created_at,updated_at
 * - FROM appointments
 * - WHERE clinic_id = $1 AND start_time >= $2 AND start_time < $3
 * - ORDER BY start_time ASC
 * 
 * Indexes Used:
 * - idx_appointments_clinic_start_time [composite index for range]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 30ms for 7-day range
 */

// =============================================================================
// 2. CLIENT REPOSITORY QUERIES
// =============================================================================

/**
 * Query: findAll(clinicId)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,name,email,phone
 * - FROM clients
 * - WHERE clinic_id = $1
 * - ORDER BY name ASC
 * 
 * Indexes Used:
 * - idx_clients_clinic_id [clinic_id filter]
 * - idx_clients_clinic_name [ordering on name]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 30ms for 1000 clients
 * - WARNING: Dashboard should use findAllPaginated for > 50 clients
 */

/**
 * Query: findAllPaginated(clinicId, page, pageSize, filters)
 * 
 * Execution Plan (with search):
 * - SELECT COUNT(id) FROM clients
 *   WHERE clinic_id = $1 AND (name ILIKE $2 OR email ILIKE $2)
 * 
 * - SELECT id,clinic_id,name,email,phone
 *   FROM clients
 *   WHERE clinic_id = $1 AND (name ILIKE $2 OR email ILIKE $2)
 *   ORDER BY name ASC
 *   LIMIT $3 OFFSET $4
 * 
 * Indexes Used:
 * - idx_clients_clinic_name [partial scan on name]
 * 
 * Expected Performance:
 * - Index Range Scan with ILIKE filter
 * - Response time: < 50ms
 * - Pagination: 20 records per page
 */

// =============================================================================
// 3. SERVICE REPOSITORY QUERIES
// =============================================================================

/**
 * Query: findAll(clinicId)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,category_id,name,duration,requires_room,requires_specialist,is_active
 * - FROM services
 * - WHERE clinic_id = $1
 * - ORDER BY name ASC
 * 
 * Indexes Used:
 * - idx_services_clinic_id [clinic_id filter]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 20ms for 100 services
 * - Safe: typical clinic has < 50 services
 */

/**
 * Query: findAllPaginated(clinicId, page, pageSize, filters)
 * 
 * Filters: { search?, categoryId?, isActive? }
 * 
 * Execution Plan:
 * - SELECT COUNT(id) FROM services
 *   WHERE clinic_id = $1 AND is_active = true
 *   AND category_id = $2
 *   AND name ILIKE $3
 * 
 * Indexes Used:
 * - idx_services_clinic_active_name [composite]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 20ms
 */

// =============================================================================
// 4. EMPLOYEE REPOSITORY QUERIES
// =============================================================================

/**
 * Query: findAll(clinicId)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,name
 * - FROM employees
 * - WHERE clinic_id = $1
 * - ORDER BY name ASC
 * 
 * Indexes Used:
 * - idx_employees_clinic_id [clinic_id filter]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 10ms for 50 employees
 * - Safe: typical clinic has < 50 employees
 */

/**
 * Query: findAllPaginated(clinicId, page, pageSize, filters)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,name
 * - FROM employees
 * - WHERE clinic_id = $1 AND name ILIKE $2
 * - ORDER BY name ASC
 * - LIMIT $3 OFFSET $4
 * 
 * Indexes Used:
 * - idx_employees_clinic_name [composite]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 15ms
 */

// =============================================================================
// 5. ROOM REPOSITORY QUERIES
// =============================================================================

/**
 * Query: findAll(clinicId)
 * 
 * Execution Plan:
 * - SELECT id,clinic_id,name,type
 * - FROM rooms
 * - WHERE clinic_id = $1
 * - ORDER BY name ASC
 * 
 * Indexes Used:
 * - idx_rooms_clinic_id [clinic_id filter]
 * 
 * Expected Performance:
 * - Index Range Scan
 * - Response time: < 10ms for 20 rooms
 * - Safe: typical clinic has < 10 rooms
 */

// =============================================================================
// 6. CLINIC REPOSITORY QUERIES
// =============================================================================

/**
 * Query: findByIdDirect(id)
 * 
 * Execution Plan:
 * - SELECT id,name,slug,email,phone,address,working_hours_start,working_hours_end,logo_url,created_at,updated_at
 * - FROM clinics
 * - WHERE id = $1
 * 
 * Indexes Used:
 * - Primary Key Index (id) [unique lookup]
 * 
 * Expected Performance:
 * - Index Unique Scan
 * - Response time: < 3ms
 * - No pagination needed: single record
 */

// =============================================================================
// 7. DASHBOARD METRICS OPTIMIZATION
// =============================================================================

/**
 * Dashboard Page Query Pattern:
 * 
 * Sequential Queries (with date range bounds):
 * 
 * Query 1: Today's appointments (scheduled)
 *   - AppointmentUseCases.getAppointmentsPaginated(1, 20, { 
 *       status: 'scheduled',
 *       startDate: today 00:00,
 *       endDate: today 23:59
 *     })
 *   - Response time: < 20ms
 * 
 * Query 2: Upcoming appointments (7 days)
 *   - AppointmentUseCases.getAppointmentsPaginated(1, 50, {
 *       status: 'scheduled',
 *       startDate: today 00:00,
 *       endDate: now + 7 days
 *     })
 *   - Response time: < 40ms
 * 
 * Query 3: Total clients (pagination 1, 20)
 *   - ClientUseCases.getClientsPaginated(1, 20)
 *   - Response time: < 15ms
 * 
 * Query 4: Active services (pagination 1, 50)
 *   - ServiceUseCases.getServicesPaginated(1, 50, { isActive: true })
 *   - Response time: < 15ms
 * 
 * Query 5: All employees (pagination 1, 50)
 *   - EmployeeUseCases.getEmployeesPaginated(1, 50)
 *   - Response time: < 10ms
 * 
 * Parallel Query Execution (Promise.all):
 * - All 5 queries executed in parallel: ~40ms total
 * 
 * Dashboard Total Response Time: < 100ms (target)
 * 
 * KEY OPTIMIZATIONS:
 * 1. Date range filters bound query scope
 * 2. Explicit column selection via .select()
 * 3. Composite indexes on frequently filtered columns
 * 4. Pagination prevents loading entire datasets
 * 5. Parallel query execution reduces latency
 */

// =============================================================================
// 8. PERFORMANCE MONITORING CHECKLIST
// =============================================================================

/**
 * Monitor these queries in production using Supabase Analytics:
 * 
 * ✓ Appointments findAllPaginated - track response time by date range width
 * ✓ Clients findAllPaginated - track search performance
 * ✓ Services findAllPaginated - track filter combinations
 * ✓ Dashboard page load - total response time (all 5 queries in parallel)
 * 
 * Red Flags to Watch:
 * ✗ Query time > 100ms for single pagination query
 * ✗ Query time > 500ms for entire dashboard page
 * ✗ Full table scans on appointments (missing date range)
 * ✗ Missing index warnings in PostgreSQL logs
 * 
 * Scaling Estimates:
 * - 1-10 clinics: current indexes sufficient
 * - 100 clinics: add partial indexes for status='scheduled'
 * - 1000 clinics: consider data archival strategy (move completed appointments)
 * - 10000+ clinics: implement separate reporting database
 */

// =============================================================================
// 9. QUERY EXECUTION RULES (CRITICAL)
// =============================================================================

/**
 * RULE 1: Date Range is Mandatory
 * When querying appointments for dashboard, ALWAYS include startDate and endDate
 * Exception: Only query without date range if < 500 total appointments
 * 
 * RULE 2: Use .select() Explicitly
 * Always specify columns instead of select('*')
 * Reduces data transfer and improves index efficiency
 * 
 * RULE 3: Pagination Required
 * Never load > 50 records at once for clients/employees/services/rooms
 * Always use findAllPaginated with page=1, pageSize=20-50
 * 
 * RULE 4: Filter Ordering (Performance)
 * Apply filters in this order for best index usage:
 * 1. Equality filters (clinic_id, status)
 * 2. Range filters (start_time, date ranges)
 * 3. Search filters (ILIKE name)
 * 4. Pagination (LIMIT, OFFSET)
 * 
 * RULE 5: Parallel Queries
 * Use Promise.all() for independent queries
 * Maximum 5 queries in parallel (connection pool limit)
 */
