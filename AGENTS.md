<!-- BEGIN:nextjs-agent-rules -->
# BeautyFlow — Product Requirements Document (PRO Version)

---

## 1. Overview

**Product Name:** BeautyFlow
**Type:** Multi-tenant SaaS
**Target Users:** Aesthetic clinics, spas, wellness studios
**Primary Market:** Brazil (initial), global expansion via i18n

**Goal:**
Build a scalable SaaS platform that centralizes clinic operations, improves scheduling efficiency, and increases revenue visibility.

---

## 2. Product Vision

BeautyFlow aims to become the **all-in-one operating system** for aesthetic clinics by:

* Managing appointments and resources efficiently
* Providing business insights and analytics
* Enabling monetization via subscriptions
* Supporting global expansion with multi-language capabilities

---

## 3. MVP Scope (STRICT)

### Included:

* Authentication (multi-tenant)
* Services & categories
* Employees
* Rooms / stations
* Appointments (core system)
* Clients (CRM basic)
* Dashboard (basic metrics)

### Excluded:

* Financial module
* Inventory management
* AI features
* Mobile app
* Advanced analytics

---

## 4. Architecture Strategy

### Phase 1 (MVP)

* Frontend + Backend combined (Next.js + Supabase)
* Direct database access via repositories

### Phase 2 (Scaling)

* Introduce separate backend API (.NET)
* Replace repository implementations only
* Frontend remains unchanged

---

## 5. Multi-Tenancy Model

* Each clinic = tenant
* All entities must include `clinic_id`
* Data isolation enforced by:

  * Application layer
  * Database (RLS policies)

---

## 6. Domain Model

### Core Entities

* Clinic
* ServiceCategory
* Service
* Employee
* Room
* Appointment
* Client

---

## 7. Domain Rules

### Appointment

* Must belong to a clinic
* Cannot overlap for same employee
* Cannot overlap for same room (if required)
* Must be within working hours
* Must have valid duration
* Must link to service and client

#### Status:

* scheduled
* completed
* canceled
* no_show

#### Transitions:

* scheduled → completed
* scheduled → canceled
* scheduled → no_show
* completed → immutable

---

### Employee

* Can perform only assigned services
* Can have multiple specializations
* Has working hours (or inherits clinic hours)

---

### Client

* Unique per clinic (email or phone)
* Stores appointment history
* Supports notes and preferences

---

### Room

* Required for certain services
* Cannot be double-booked
* Types: room | station

---

## 8. Domain Events

* AppointmentCreated
* AppointmentCanceled
* AppointmentCompleted
* ClientCreated
* NoShowRegistered

---

## 9. User Flows

### Admin Flow

1. Register clinic
2. Create services
3. Add employees
4. Add rooms
5. Start scheduling

---

### Employee Flow

1. Login
2. View schedule
3. Update appointment status

---

### Future: Client Booking

1. Access public page
2. Select service
3. Choose time
4. Confirm booking

---

## 10. Subscription & Billing

### Plans

#### Free

* Limited services (3)
* Max 2 employees
* 1 room
* No advanced features

#### Pro

* Unlimited services
* Unlimited employees
* Multiple rooms
* Access to advanced features

---

### Billing Flow

1. User selects plan
2. Redirect to payment provider (Stripe)
3. Webhook updates subscription
4. Store:

   * plan
   * status
   * renewal_date

---

### Rules

* Free plan enforces limits
* Pro unlocks features
* Failed payment → grace period → downgrade

---

## 11. Data Access Strategy

* All data access via repositories
* No direct DB calls in UI
* Pattern: Result<T>

---

## 12. Repository Abstraction

Example:

```
interface IAppointmentRepository {
  create()
  findByDateRange()
}
```

Implementations:

* Supabase (MVP)
* API (.NET) future

---

## 13. Frontend Pages

* /dashboard
* /appointments
* /clients
* /services
* /employees
* /rooms
* /settings

---

## 14. Definition of Done

A feature is complete when:

* UI works correctly
* Business rules enforced
* Tests pass
* Migration created (if needed)
* No console errors
* Multi-tenancy respected

---

## 15. Testing Strategy

* Unit tests for domain rules
* Integration tests for data layer
* End-to-end (future)

---

## 16. Performance Requirements

* Queries must be scoped by date
* Pagination required
* Avoid N+1 queries

---

## 17. Security Requirements

* Row Level Security enabled
* JWT contains clinic_id
* Validate all inputs
* Service keys server-side only

---

## 18. SEO & Internationalization

* i18n support: en, pt, es, fr
* Public pages indexed
* Dashboard private (no index)

---

## 19. Success Metrics

* Number of clinics created
* Appointments per clinic
* Daily active users
* Retention (7 / 30 days)

---

## 20. Development Workflow

After EVERY change:

1. Run tests
2. Create migration (if DB changed)
3. Update documentation
4. Validate multi-tenancy
5. Commit with clear message

---

## 21. Non-Functional Requirements

### Scalability

* Index clinic_id
* Efficient queries

### Maintainability

* Clean Architecture
* Domain-driven structure

### Performance

* Optimized queries
* Minimal data load

### Security

* Strict isolation
* Input validation

---

## 22. Agent Instructions (FOR AI)

You are a senior fullstack engineer.

### Rules:

* Follow DDD and Clean Architecture
* Never break multi-tenancy
* Use repository pattern
* Do not add logic to UI
* Always return Result<T>

### Process:

1. Read this document fully
2. Create a plan
3. Implement step by step
4. Validate rules after each step

### Priority:

Build ONLY MVP features first.

---

## 23. Future Roadmap

* Packages & combos
* Notifications (WhatsApp/SMS)
* Public booking page
* Financial module
* Multi-location
* Mobile app
* Backend API (.NET)

---

## END OF DOCUMENT

<!-- END:nextjs-agent-rules -->
