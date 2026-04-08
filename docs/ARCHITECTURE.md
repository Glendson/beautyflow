# BeautyFlow Architecture Guide

This document describes the current architecture of BeautyFlow and how it's designed for scalability and maintainability.

## Architecture Overview

BeautyFlow follows **Domain-Driven Design (DDD)** and **Clean Architecture** principles, organized in layers:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Presentation Layer                           │
│              (Next.js Pages, Components, Layouts)               │
│                   /app, /components                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Server Actions Layer                          │
│               (use server, Request Handlers)                    │
│            /app/*/actions.ts, /app/api/*                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    Services Layer (NEW)                          │
│           (Business Logic Orchestration)                         │
│  /lib/services/ → Coordinates all domain operations              │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                 Application Layer (Use Cases)                    │
│    (Business Rules, Validation, Domain Logic)                   │
│              /application/**/*UseCases.ts                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                  Domain Layer (Entities)                         │
│         (Pure Business Logic, Invariants)                        │
│         /domain/**/Entity.ts, Validator.ts                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│              Infrastructure Layer (Persistence)                  │
│          (Repositories, Database Access, External APIs)         │
│   /infrastructure/repositories/**, /lib/supabase/**             │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Supabase (Database)                         │
│           (PostgreSQL + RLS, Auth, Storage)                     │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Descriptions

### 1. Presentation Layer (`/src/app`, `/src/components`)

**Responsibility:** Render UI and handle user interactions.

- **Pages:** Route handlers and layouts (`/app/(dashboard)/appointments/page.tsx`)
- **Components:** Reusable UI pieces (`/components/ui/Button.tsx`)
- **Layouts:** Shared page structures (`/app/(dashboard)/layout.tsx`)

**Rules:**
- ✅ Import components and utilities
- ❌ Never import Supabase client directly
- ❌ Never call repositories or database code
- ✅ Call Server Actions to perform operations

### 2. Server Actions Layer (`/app/*/actions.ts`)

**Responsibility:** Bridge between UI and business logic. Marked with `"use server"`.

**Example:**
```typescript
// /app/(dashboard)/appointments/actions.ts
"use server"

import { AppointmentService } from "@/lib/services"
import { revalidatePath } from "next/cache"

export async function createAppointmentAction(formData: FormData) {
  const data = Object.fromEntries(formData.entries())
  
  const result = await AppointmentService.create({
    client_id: data.client_id as string,
    service_id: data.service_id as string,
    employee_id: data.employee_id as string,
    room_id: (data.room_id as string) || null,
    start_time: new Date(data.start_time as string),
    end_time: new Date(data.end_time as string),
  })
  
  if (result.success) {
    revalidatePath("/appointments")
    return { success: true, data: result.data }
  }
  
  return { success: false, error: result.error }
}
```

**Rules:**
- ✅ Call Services (not Repositories)
- ✅ Validate input (best: use Zod schemas)
- ✅ Return `Result<T>` for consistent error handling
- ❌ Never import Supabase directly
- ✅ Call `revalidatePath()` or `revalidateTag()` after mutations

### 3. Services Layer (NEW) (`/lib/services`)

**Responsibility:** Orchestrate domain operations. Provides a clean interface for Server Actions.

**Services Created:**
- `AppointmentService` — appointment management
- `ClientService` — client/customer management
- `EmployeeService` — employee management
- `RoomService` — room/station management
- `ServiceService` → exported as `ServiceService` in `beauty-services.service.ts`
- `ClinicService` — clinic settings

**Example:**
```typescript
// /lib/services/appointments.service.ts
import { AppointmentUseCases } from "@/application/appointment/AppointmentUseCases"

export const AppointmentService = {
  async create(data): Promise<Result<Appointment>> {
    return AppointmentUseCases.createAppointment(data)
  },
  
  async updateStatus(id, status): Promise<Result<Appointment>> {
    return AppointmentUseCases.updateAppointmentStatus(id, status)
  },
  // ... more methods
}
```

**Rules:**
- ✅ Import Use Cases (not Repositories)
- ✅ Methods are async and return `Result<T>`
- ✅ Coordinate multiple Use Cases if needed
- ✅ Provide convenient, high-level API
- ❌ Never access Supabase directly
- ✅ Act as facades to the Application layer

**Why Services Layer?**
1. **Separation of Concerns:** Clear boundary between orchestration and business logic
2. **Reusability:** Same service used by Server Actions, API routes, or event handlers
3. **Future Backend Migration:** Services can be moved to .NET API without changing Server Actions
4. **Testing:** Easy to mock services in tests

### 4. Application Layer (Use Cases) (`/src/application`)

**Responsibility:** Implement business logic and validate domain rules.

**Example:**
```typescript
// /src/application/appointment/AppointmentUseCases.ts
export class AppointmentUseCases {
  static async createAppointment(data) {
    const clinicId = await getClinicId()
    if (!clinicId) return Result.fail("Unauthorized")
    
    // Validate business rules
    const hwResult = AppointmentValidator.validateWorkingHours(
      data.start_time,
      data.end_time
    )
    if (!hwResult.success) return hwResult
    
    // Check for conflicts
    const existingResult = await repository.findByDateRange(
      clinicId,
      startDate,
      endDate
    )
    if (!existingResult.success) return existingResult
    
    // Create appointment
    return repository.create({ ...data, clinic_id: clinicId })
  }
}
```

**Rules:**
- ✅ Import Repositories and Validators
- ✅ Implement business rules (conflicts, validations)
- ✅ Return `Result<T>`
- ❌ Never interact with HTTP or UI concepts
- ✅ Validate multi-tenancy (`getClinicId()`)

### 5. Domain Layer (`/src/domain`)

**Responsibility:** Define core business entities and rules. Pure, no dependencies.

**Example:**
```typescript
// /src/domain/appointment/Appointment.ts
export interface Appointment {
  id: string
  clinic_id: string
  client_id: string
  service_id: string
  employee_id: string
  room_id: string | null
  start_time: Date
  end_time: Date
  status: "scheduled" | "completed" | "canceled" | "no_show"
  created_at: Date
  updated_at: Date
}

// /src/domain/appointment/AppointmentValidator.ts
export class AppointmentValidator {
  static validateWorkingHours(start: Date, end: Date): Result<void> {
    if (start >= end) return Result.fail("Start time must be before end time")
    const duration = (end.getTime() - start.getTime()) / 60000
    if (duration < 15) return Result.fail("Appointment must be at least 15 minutes")
    return Result.ok()
  }
}
```

**Rules:**
- ✅ Define interfaces/types
- ✅ Implement domain-specific validation
- ❌ No dependencies on outside layers
- ✅ Pure business logic

### 6. Infrastructure Layer (`/src/infrastructure`)

**Responsibility:** Implement persistence and external integrations.

**Structure:**
```
/src/infrastructure/
├── repositories/supabase/
│   ├── AppointmentRepository.ts
│   ├── ClientRepository.ts
│   └── ...
├── supabase/
│   ├── server.ts       # SSR client
│   ├── client.ts       # Browser client
│   ├── admin.ts        # Service role (server-side only)
│   └── middleware.ts   # Auth refresh
└── migrations/         # Database schema changes
```

**Example:**
```typescript
// /src/infrastructure/repositories/supabase/AppointmentRepository.ts
export class AppointmentRepository implements IAppointmentRepository {
  async create(data): Promise<Result<Appointment>> {
    const supabase = await createClient() // Server client
    const { data: result, error } = await supabase
      .from('appointments')
      .insert([data])
      .select()
      .single()
    
    if (error) return Result.fail(error.message)
    return Result.ok(this.mapToEntity(result))
  }
  
  async findById(id, clinicId): Promise<Result<Appointment>> {
    // ... implementation
  }
}
```

**Rules:**
- ✅ Implement `IRepository` interfaces
- ✅ Use only Supabase clients (from `/lib/supabase/`)
- ✅ Return `Result<T>`
- ❌ No business logic here
- ✅ Map database results to domain entities

## Data Flow Examples

### Example 1: Creating an Appointment

```
User fills form
         ↓
<Presentation Layer>
  Submits form to Server Action
         ↓
<Server Actions>
  createAppointmentAction()
  Validates input (Zod schema)
  Calls AppointmentService.create()
         ↓
<Services Layer>
  AppointmentService.create()
  Delegates to AppointmentUseCases.createAppointment()
         ↓
<Application Layer (Use Cases)>
  AppointmentUseCases.createAppointment()
  - Validates clinic_id (multi-tenancy)
  - Calls AppointmentValidator.validateWorkingHours()
  - Calls repository.findByDateRange() to check conflicts
  - Calls repository.create()
         ↓
<Domain Layer>
  AppointmentValidator checks business rules
  Returns Result<Appointment>
         ↓
<Infrastructure Layer (Repositories)>
  AppointmentRepository.create()
  Calls Supabase API to INSERT
  Maps database result to Appointment entity
  Returns Result<Appointment>
         ↓
<Supabase>
  Database inserts row
  RLS policy checks clinic_id
  Return created appointment
         ↓
<Server Action>
  Receives Result<Appointment>
  Calls revalidatePath("/appointments")
  Returns success response
         ↓
<Presentation>
  Shows success toast
  Refreshes appointment list
```

### Example 2: Fetching Appointments

```
Page loads
         ↓
<Presentation Layer>
  Component calls Server Action (getAppointmentsAction)
         ↓
<Server Action>
  Calls AppointmentService.getPaginated()
         ↓
<Services Layer>
  Delegates to AppointmentUseCases.getAppointmentsPaginated()
         ↓
<Application Layer>
  Validates clinic_id
  Calls repository.findAllPaginated()
         ↓
<Infrastructure Layer>
  Queries database with clinic_id filter
  Maps results to Appointment entities
  Returns paginated result
         ↓
<Server Action>
  Returns Result<PaginatedResult<Appointment>>
         ↓
<Presentation>
  Renders appointment list
```

## Multi-Tenancy

**Every operation enforces clinic isolation:**

1. **Authentication:** User's `clinic_id` comes from JWT token via `getClinicId()`
2. **Use Cases:** Check `clinic_id` before any operation
3. **Database:** RLS policies on all tables enforce `clinic_id` isolation
4. **Repositories:** Queries always filter by `clinic_id`

**Example:**
```typescript
// Use Case validates clinic_id
const clinicId = await getClinicId() // From JWT
if (!clinicId) return Result.fail("Unauthorized")

// Repository filters by clinic_id
const appointment = await repository.findById(appointmentId, clinicId)

// Database RLS double-checks
// SELECT * FROM appointments WHERE id = ? AND clinic_id = ? 
// AND clinic_id IN (SELECT clinic_id FROM user_profiles WHERE id = auth.uid())
```

## Error Handling: Result<T> Pattern

**All functions return `Result<T>`:**

```typescript
interface Result<T> {
  success: boolean
  data?: T
  error?: string
}
```

**Usage:**
```typescript
const result = await AppointmentService.create(data)

if (result.success) {
  // result.data is available and typed
  console.log(result.data.id)
} else {
  // result.error is string
  console.error(result.error)
}
```

## Testing Strategy

### Unit Tests (Domain Layer)

Test validators and business rules:
```typescript
// /src/domain/appointment/__tests__/AppointmentValidator.test.ts
test("validateWorkingHours should fail if start >= end", () => {
  const result = AppointmentValidator.validateWorkingHours(
    new Date("2024-01-01 10:00"),
    new Date("2024-01-01 10:00")
  )
  expect(result.success).toBe(false)
})
```

### Integration Tests (Use Cases)

Test with mock repositories:
```typescript
// /src/application/__tests__/AppointmentUseCases.test.ts
test("createAppointment should fail for conflicting appointments", async () => {
  const mockRepo = { findByDateRange: jest.fn().mockResolvedValue(...) }
  // Test logic with mocked repository
})
```

### E2E Tests

Test full flows with real database:
```typescript
// /e2e/appointments.spec.ts
test("User can create appointment", async ({ page }) => {
  // Navigate, fill form, submit
  // Verify appointment created in database
})
```

## Future: .NET Backend Migration

The architecture is designed for smooth backend migration:

**Current PHASE:**
```
Server Actions → Services → Use Cases → Repositories → Supabase
```

**Future PHASE (Backend .NET):**
```
Server Actions → API Routes → Services (.NET) → Database
```

**No changes needed to:**
- Service method signatures (same interface)
- Use Cases (moved to backend)
- Server Actions (mostly same, now call API routes)

## Conventions

### Naming

| Layer | Example | Pattern |
|-------|---------|---------|
| Service | `AppointmentService` | Domain noun + Service |
| UseCase | `AppointmentUseCases` | Domain noun + UseCases |
| Repository | `AppointmentRepository` | Domain noun + Repository |
| Entity | `Appointment` | Domain noun |
| Validator | `AppointmentValidator` | Domain noun + Validator |
| Server Action | `createAppointmentAction` | verb + Domain noun + Action |
| Interface | `IAppointmentRepository` | I + Domain noun + Repository |

### File Structure

```
src/
├── domain/
│   └── appointment/
│       ├── Appointment.ts           # Entity
│       ├── AppointmentValidator.ts  # Validator
│       └── IAppointmentRepository.ts # Interface
│
├── application/
│   └── appointment/
│       └── AppointmentUseCases.ts   # Use Case
│
├── infrastructure/
│   └── repositories/supabase/
│       └── AppointmentRepository.ts # Implementation
│
├── lib/
│   └── services/
│       └── appointments.service.ts  # Service Facade
│
└── app/
    └── (dashboard)/appointments/
        └── actions.ts               # Server Action
```

### Imports

**Correct:**
```typescript
// Service imports Use Cases
import { AppointmentUseCases } from "@/application/..."

// Use Case imports Repository Interface
import { IAppointmentRepository } from "@/domain/..."

// Server Action imports Service
import { AppointmentService } from "@/lib/services"

// Repository imports Entity
import { Appointment } from "@/domain/..."
```

**Incorrect (will cause circular dependencies):**
```typescript
// ❌ Server Action importing Repository
import { AppointmentRepository } from "@/infrastructure/..."

// ❌ Component importing Supabase directly
import { createClient } from "@supabase/supabase-js"

// ❌ Use Case importing Service
import { AppointmentService } from "@/lib/services"
```

## Checklist: Adding a New Feature

When implementing a new feature, follow this checklist to maintain architecture consistency:

- [ ] **Database:** Create migration in `/supabase/migrations/` with RLS policies
- [ ] **Domain:** Define entity in `/domain/[feature]/[Entity].ts`
- [ ] **Domain:** Create validator in `/domain/[feature]/[Validator].ts` if needed
- [ ] **Domain:** Define interface in `/domain/[feature]/I[Feature]Repository.ts`
- [ ] **Repository:** Implement in `/infrastructure/repositories/supabase/[Feature]Repository.ts`
- [ ] **Use Case:** Create in `/application/[feature]/[Feature]UseCases.ts`
- [ ] **Service:** Create in `/lib/services/[feature].service.ts`
- [ ] **Server Action:** Create in `/app/(dashboard)/[feature]/actions.ts`
- [ ] **Page:** Create in `/app/(dashboard)/[feature]/page.tsx`
- [ ] **Component:** Create in `/components/[feature]/`
- [ ] **Tests:** Add unit tests in `/src/tests/`
- [ ] **Types:** Update `/src/lib/types/database.types.ts` via `npm run db:types`

---

**Questions?** Refer to this guide when implementing new features or refactoring existing code.
