# 📋 PLANO DE IMPLEMENTAÇÃO VISUAL + BACKEND - BEAUTYFLOW

## EXECUÇÃO FASEADA COM WORKFLOW UX/SENIOR - 04/03/2026

---

## 🎯 DIAGNÓSTICO ATUAL

### ✅ STATUS DOS DASHBOARD PAGES

| Página | Layout | MockData | Filtros | UI | API | Actions |
|--------|--------|----------|---------|----|----|---------|
| **Appointments** | ✅ 100% | ✅ | ✅✅ | ✅ | ❌ | ❌ |
| **Clients** | ✅ 100% | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Services** | ✅ 100% | ✅ | ✅✅ | ✅ | ❌ | ❌ |
| **Employees** | ✅ 100% | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Rooms** | ✅ 100% | ✅ | ✅✅ | ✅ | ❌ | ❌ |

### ✅ O QUE ESTÁ PRONTO
- 🎨 UI/Layout profissional e completo
- 📊 MockData bem estruturado
- 🔍 Filtros e buscas funcionando
- 🎯 Scaffolding pronto para integração
- 📭 Empty states implementados
- 💰 Formatação PT-BR (moeda)
- ⭐ Components: Avatar, Badge, Table, Card

### ❌ O QUE FALTA

**1. Integração com Supabase** (dados reais)
- ❌ Nenhuma página carrega dados do banco
- ❌ Todas ainda usam mockData hardcoded

**2. Handlers de Ações**
- ❌ Botões Edit/Delete/View vazios
- ❌ Nenhum formulário de criação
- ❌ Sem validações

**3. Componentes Missing** (já criados)
- ✅ Modal (criado)
- ✅ Pagination (criado)
- ❌ Form Components (input validados com ErrorMessage)
- ❌ DeleteConfirmation Modal reutilizável

**4. Features**
- ❌ Paginação em lista
- ❌ Real-time updates
- ❌ Sorting por coluna
- ❌ Bulk actions

---

## 📊 ESFORÇO ESTIMADO

```
┌────────────────────────────────────────────────────────────┐
│ TAREFA                          │ ESFORÇO  │ SENIORIDADE   │
├────────────────────────────────────────────────────────────┤
│ UX Design (Figma refinements)   │ 4-6h    │ UI/UX Senior  │
│ Server Actions CRUD (5 entities)│ 16-20h  │ Backend Senior│
│ Repository updates (limit/offset)│ 4-6h   │ Backend Senior│
│ Form components + validation    │ 6-8h    │ Frontend Snr  │
│ Integration pages (5 pages)     │ 8-10h   │ Frontend Snr  │
│ Modal/Pagination integration    │ 4-6h    │ Frontend Snr  │
│ Testing (unit/e2e)              │ 8-10h   │ QA Senior     │
├────────────────────────────────────────────────────────────┤
│ TOTAL                           │ 50-66h  │ 2 semanas FTE │
└────────────────────────────────────────────────────────────┘
```

---

## 🏗️ WORKFLOW RECOMENDADO

### OPÇÃO 1: WORKFLOW PROFISSIONAL (Recomendado)

```
SEMANA 1: UX + Backend Paralelo
├─ SEG-TER (UX SENIOR): Design refinements no Figma
│  ├─ Create form designs (Create Appointment, Client, Service, Employee, Room)
│  ├─ Modal designs (Delete, Edit, Confirmation)
│  ├─ Empty states + Loading states
│  ├─ Error states + Toast notifications
│  └─ Export components set para frontend
│
└─ SEG-QUI (BACKEND SENIOR): Infrastructure setup
   ├─ Repository updates com limit/offset/filter
   ├─ UseCase expansão com validações
   ├─ Server actions para CRUD completo
   └─ Tests para validações

SEMANA 2: Frontend Integration (FRONTEND SENIOR)
├─ SEG-TER: Form components + Modal integration
├─ TER-QUA: Page refactoring (migrate mockData → server actions)
├─ QUA-QUI: Pagination integration
└─ QUI-SEX: Testing + Bug fixes

SEMANA 3: Polish + QA
├─ Performance optimization
├─ Accessibility audit (a11y)
├─ E2E tests
└─ Production readiness
```

### OPÇÃO 2: RÁPIDO (Só Backend + Frontend, sem UX formal)

- Pular design e ir direto para implementação
- Usar padrões existentes (já está 100% pronto UI)
- **RECOMENDAÇÃO**: Opção 1 é melhor - 4-6h do UX vale muito

---

## 📝 FASES DE IMPLEMENTAÇÃO DETALHADAS

## FASE 1: UX/DESIGN REFINEMENT (UX SENIOR + Figma)

### 1.1 - Criar Design System no Figma (4h)

**Responsável**: UI/UX Senior  
**Entregável**: Figma file com componentes

**Tarefas**:
```
☐ Criar MAIN form pattern:
  ├─ Input com label + error message
  ├─ Select/Dropdown com label
  ├─ MultiSelect (para especialidades, equipamentos)
  ├─ DatePicker + TimePicker
  ├─ Checkbox + Radio
  └─ TextArea com char counter

☐ Criar Modal variations:
  ├─ Delete confirmation
  ├─ Create entity
  ├─ Edit entity
  └─ View details

☐ Criar états:
  ├─ Loading states (skeleton, spinner)
  ├─ Empty states (por página)
  ├─ Error states (inline + toast)
  └─ Success states

☐ Criar page variants:
  ├─ List (com dados)
  ├─ List (vazio)
  ├─ Create flow
  └─ Edit flow
```

**Output**: Figma components prontos para Code Connect

---

### 1.2 - Criar Code Connect Mappings (2h)

**Responsável**: UI/UX Senior + Frontend Senior  
**Entregável**: Code Connect templates na Figma

**Tasks**:
- Map FormInput → React component
- Map Modal → React component
- Map LoadingState → Skeleton component
- Export templates para ./src/components/forms/

**Benefício**: Frontend consegue fazer `import FormInput from Figma`

---

## FASE 2: BACKEND INFRASTRUCTURE (Backend SENIOR)

### 2.1 - Update Repositories com Pagination (3h)

**Responsável**: Backend Senior  
**Files**: 
- src/infrastructure/repositories/supabase/AppointmentRepository.ts
- src/infrastructure/repositories/supabase/ClientRepository.ts
- src/infrastructure/repositories/supabase/ServiceRepository.ts
- src/infrastructure/repositories/supabase/EmployeeRepository.ts
- src/infrastructure/repositories/supabase/RoomRepository.ts

**Pattern**:
```typescript
async findAll(clinicId: string, options?: {
  limit?: number;
  offset?: number;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
  filters?: Record<string, any>;
}): Promise<Result<{ data: T[], total: number }>> {
  // Implement with limit/offset
  // Return { data, total } para pagination frontend
}
```

**Checklist**:
- [ ] AppointmentRepository.findAll() com limit/offset
- [ ] ClientRepository.findAll()
- [ ] ServiceRepository.findAll()
- [ ] EmployeeRepository.findAll()
- [ ] RoomRepository.findAll()
- [ ] Adicionar tests

---

### 2.2 - Expandir UseCases com Validações (4h)

**Responsável**: Backend Senior  
**Files**:
- src/application/appointment/AppointmentUseCases.ts (expandir)
- src/application/client/ClientUseCases.ts (create new)
- src/application/service/ServiceUseCases.ts (expandir)
- src/application/employee/EmployeeUseCases.ts (create new)
- src/application/room/RoomUseCases.ts (create new)

**Pattern por UseCase**:
```typescript
export class AppointmentUseCases {
  // GET
  static async listAppointments(
    clinicId: string,
    options: PaginationOptions
  ): Promise<Result<PaginatedResult<Appointment>>> {
    // Chamar repo.findAll(clinicId, options)
    // Return Result com { data, total, page, pages }
  }

  // CREATE
  static async createAppointment(data: Partial<Appointment>): Promise<Result<Appointment>> {
    // Validação 1: Required fields (date, time, client_id, service_id, employee_id)
    // Validação 2: Appointment not conflicting (same employee/room)
    // Validação 3: Within working hours
    // Validação 4: Employee can perform service
    // Chamar repo.create()
  }

  // UPDATE
  static async updateAppointment(
    id: string,
    data: Partial<Appointment>
  ): Promise<Result<Appointment>> {
    // Validações similares
    // Chamar repo.update()
  }

  // DELETE
  static async deleteAppointment(id: string): Promise<Result<void>> {
    // Validação: Appointment não está em andamento?
    // Chamar repo.delete()
  }

  // UPDATE STATUS
  static async updateAppointmentStatus(
    id: string,
    status: AppointmentStatus
  ): Promise<Result<Appointment>> {
    // Validação: Transição válida (scheduled → completed ou canceled)
    // Chamar repo.update()
  }
}
```

**Validações Específicas**:

#### Appointments
```
- ✓ date/time não no passado
- ✓ employee pode fazer esse service?
- ✓ não overlap com outro appointment do mesmo employee
- ✓ se room required: room está disponível?
- ✓ within clinic working hours
```

#### Clients
```
- ✓ email válido
- ✓ email único por clinic
- ✓ phone válido (11 dígitos Brasil)
```

#### Services
```
- ✓ name não vazio
- ✓ duration > 0 e ≤ 480 min
- ✓ price ≥ 0
- ✓ categoria existe
```

#### Employees
```
- ✓ name não vazio
- ✓ email válido e único
- ✓ specialties não vazio
- ✓ working_hours_start < working_hours_end
```

#### Rooms
```
- ✓ name não vazio
- ✓ type válido (room, station, waiting)
- ✓ capacity > 0
```

**Checklist**:
- [ ] AppointmentUseCases completo (CRUD + updateStatus + validações)
- [ ] ClientUseCases completo
- [ ] ServiceUseCases expandido
- [ ] EmployeeUseCases completo
- [ ] RoomUseCases completo
- [ ] Unit tests para cada usecase

---

### 2.3 - Criar Server Actions CRUD (6h)

**Responsável**: Backend Senior  
**File**: src/app/(auth)/actions.ts (expandir)

**Server Actions a criar**:

```typescript
// ==================== APPOINTMENTS ====================
export async function listAppointmentsAction(
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<Result<PaginatedResult<Appointment>>>

export async function createAppointmentAction(
  data: Partial<Appointment>
): Promise<Result<Appointment>>

export async function updateAppointmentAction(
  id: string,
  data: Partial<Appointment>
): Promise<Result<Appointment>>

export async function deleteAppointmentAction(
  id: string
): Promise<Result<void>>

export async function updateAppointmentStatusAction(
  id: string,
  status: AppointmentStatus
): Promise<Result<Appointment>>

// ==================== CLIENTS ====================
export async function listClientsAction(
  page: number,
  pageSize: number,
  search?: string
): Promise<Result<PaginatedResult<Client>>>

export async function createClientAction(
  data: Partial<Client>
): Promise<Result<Client>>

export async function updateClientAction(
  id: string,
  data: Partial<Client>
): Promise<Result<Client>>

export async function deleteClientAction(
  id: string
): Promise<Result<void>>

// ==================== SERVICES ====================
export async function listServicesAction(
  page: number,
  pageSize: number,
  categoryId?: string
): Promise<Result<PaginatedResult<Service>>>

export async function createServiceAction(
  data: Partial<Service>
): Promise<Result<Service>>

export async function updateServiceAction(
  id: string,
  data: Partial<Service>
): Promise<Result<Service>>

export async function deleteServiceAction(
  id: string
): Promise<Result<void>>

// ==================== EMPLOYEES ====================
export async function listEmployeesAction(
  page: number,
  pageSize: number,
  search?: string
): Promise<Result<PaginatedResult<Employee>>>

export async function createEmployeeAction(
  data: Partial<Employee>
): Promise<Result<Employee>>

export async function updateEmployeeAction(
  id: string,
  data: Partial<Employee>
): Promise<Result<Employee>>

export async function deleteEmployeeAction(
  id: string
): Promise<Result<void>>

// ==================== ROOMS ====================
export async function listRoomsAction(
  page: number,
  pageSize: number,
  type?: string
): Promise<Result<PaginatedResult<Room>>>

export async function createRoomAction(
  data: Partial<Room>
): Promise<Result<Room>>

export async function updateRoomAction(
  id: string,
  data: Partial<Room>
): Promise<Result<Room>>

export async function deleteRoomAction(
  id: string
): Promise<Result<void>>
```

**Pattern por ação**:
```typescript
export async function createAppointmentAction(
  data: Partial<Appointment>
): Promise<Result<Appointment>> {
  const clinicId = await getClinicId();
  if (!clinicId) return Result.fail("Unauthorized");
  
  const result = await AppointmentUseCases.createAppointment(data);
  if (!result.success) return result;
  
  revalidatePath("/appointments");
  return result;
}
```

**Checklist**:
- [ ] 5 server actions listXxx (com page, pageSize, filters)
- [ ] 15 server actions CRUD (3 por entity × 5 entities)
- [ ] Todas com getClinicId() validation
- [ ] Todas com revalidatePath()
- [ ] Todas retornam Result<T>

---

## FASE 3: FRONTEND COMPONENTS + FORMS (Frontend SENIOR)

### 3.1 - Criar Form Components (3h)

**Responsável**: Frontend Senior  
**Files**: src/components/forms/

**Components a criar**:

```typescript
// 1. FormInput.tsx
<FormInput
  name="clientEmail"
  label="Email"
  type="email"
  error={errors.clientEmail}
  value={values.clientEmail}
  onChange={handleChange}
  required
/>

// 2. FormSelect.tsx
<FormSelect
  name="categoryId"
  label="Categoria"
  options={categories}
  value={selectedCategory}
  onChange={handleChange}
  error={errors.categoryId}
/>

// 3. FormMultiSelect.tsx (para specialties, equipment)
<FormMultiSelect
  name="specialties"
  label="Especialidades"
  options={availableSpecialties}
  selected={selectedSpecialties}
  onChange={handleChange}
  error={errors.specialties}
/>

// 4. FormDatePicker.tsx
<FormDatePicker
  name="appointmentDate"
  label="Data do Agendamento"
  value={date}
  onChange={handleChange}
  minDate={new Date()}
  error={errors.appointmentDate}
/>

// 5. FormTimePicker.tsx
<FormTimePicker
  name="appointmentTime"
  label="Horário"
  value={time}
  onChange={handleChange}
  error={errors.appointmentTime}
/>

// 6. FormTextarea.tsx
<FormTextarea
  name="notes"
  label="Notas"
  value={notes}
  onChange={handleChange}
  error={errors.notes}
  maxLength={500}
  rows={4}
/>
```

**Padrão de erro**:
```typescript
{error && (
  <span className="text-xs text-red-600 mt-1 block">
    {error}
  </span>
)}
```

**Checklist**:
- [ ] FormInput (text, email, password, number)
- [ ] FormSelect
- [ ] FormMultiSelect
- [ ] FormDatePicker
- [ ] FormTimePicker
- [ ] FormTextarea
- [ ] FormCheckbox
- [ ] FormRadio
- [ ] Todos com error messages integrados

---

### 3.2 - Criar Modal Delete Reutilizável (1h)

**Responsável**: Frontend Senior  
**File**: src/components/modals/DeleteConfirmationModal.tsx

```typescript
interface DeleteConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading?: boolean;
  title?: string;
  description?: string;
  entityName?: string;
}

export function DeleteConfirmationModal({
  open,
  onClose,
  onConfirm,
  isLoading,
  title = "Confirmar Exclusão",
  description = "Essa ação é irreversível.",
  entityName = "registro"
}: DeleteConfirmationModalProps) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-slate-700">
        Tem certeza que deseja deletar este {entityName}? {description}
      </p>
      <div className="flex gap-3 mt-6">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          Cancelar
        </Button>
        <Button 
          variant="danger" 
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Deletando..." : "Deletar"}
        </Button>
      </div>
    </Modal>
  );
}
```

---

### 3.3 - Refactor Pages (Migrate MockData → Server Actions) (8h)

**Responsável**: Frontend Senior  
**Timeline**: 2-3 dias (2-3 páginas por dia)

#### 3.3.1 - Appointments Page Refactor (2h)

**Arquivo**: src/app/(dashboard)/appointments/page.tsx

**Changes**:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { listAppointmentsAction, deleteAppointmentAction, updateAppointmentStatusAction } from '@/app/(auth)/actions';
import { Modal, Pagination } from '@/components/ui';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { CreateAppointmentModal } from '@/components/modals/CreateAppointmentModal';

export default function AppointmentsPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [appointments, setAppointments] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Create modal state
  const [createModal, setCreateModal] = useState(false);
  
  // Edit modal state
  const [editModal, setEditModal] = useState({ open: false, id: null });

  // Load appointments
  useEffect(() => {
    const loadAppointments = async () => {
      setIsLoading(true);
      const result = await listAppointmentsAction(page, pageSize, {
        search: searchTerm,
        status: statusFilter
      });
      
      if (result.success) {
        setAppointments(result.data.data);
        setTotal(result.data.total);
      }
      setIsLoading(false);
    };

    loadAppointments();
  }, [page, pageSize, searchTerm, statusFilter]);

  const handleDelete = async (id) => {
    setIsDeleting(true);
    const result = await deleteAppointmentAction(id);
    if (result.success) {
      setDeleteModal({ open: false, id: null });
      // Reload
      const reloadResult = await listAppointmentsAction(page, pageSize);
      setAppointments(reloadResult.data?.data || []);
    }
    setIsDeleting(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  if (isLoading && page === 1) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agendamentos</h1>
        <Button onClick={() => setCreateModal(true)}>
          <Plus className="w-5 h-5 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filters */}
      <Card padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            placeholder="Buscar por cliente ou serviço..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 border border-slate-300 rounded-lg"
          >
            <option value="">Todos os status</option>
            <option value="scheduled">Agendado</option>
            <option value="completed">Completo</option>
            <option value="canceled">Cancelado</option>
            <option value="no_show">Não comparecer</option>
          </select>
        </div>
      </Card>

      {/* Table */}
      {appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          <Card padding="lg">
            <Table>
              {/* Header & Body */}
            </Table>
          </Card>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Modals */}
      <DeleteConfirmationModal
        open={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: null })}
        onConfirm={() => handleDelete(deleteModal.id)}
        isLoading={isDeleting}
        entityName="agendamento"
      />

      <CreateAppointmentModal
        open={createModal}
        onClose={() => setCreateModal(false)}
        onSuccess={() => {
          setCreateModal(false);
          setPage(1);
          // Reload
        }}
      />
    </div>
  );
}
```

**Checklist Appointments**:
- [ ] Remove mockData import
- [ ] Add listAppointmentsAction call
- [ ] Add deleteAppointmentAction call
- [ ] Add updateAppointmentStatusAction call
- [ ] Add state: page, pageSize, total, isLoading
- [ ] Add DeleteConfirmationModal
- [ ] Add CreateAppointmentModal
- [ ] Add Pagination component
- [ ] Add filters: search + status
- [ ] Add empty state
- [ ] Add loading state
- [ ] Add error handling

#### 3.3.2 - Clients Page Refactor (1.5h)
Seguir padrão similar a Appointments

#### 3.3.3 - Services Page Refactor (1.5h)

#### 3.3.4 - Employees Page Refactor (1.5h)

#### 3.3.5 - Rooms Page Refactor (1.5h)

---

### 3.4 - Criar Create/Edit Modals (3h)

**Responsável**: Frontend Senior  
**Files**: src/components/modals/

**Modals a criar**:
- CreateAppointmentModal.tsx (2h - mais complex)
- CreateClientModal.tsx (30min)
- CreateServiceModal.tsx (30min)
- CreateEmployeeModal.tsx (30min)
- CreateRoomModal.tsx (30min)

**Pattern por Modal**:
```typescript
interface CreateAppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
}

export function CreateAppointmentModal({
  open,
  onClose,
  onSuccess
}: CreateAppointmentModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    client_id: '',
    service_id: '',
    employee_id: '',
    room_id: '',
    date: '',
    time: '',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await createAppointmentAction(formData);
    
    if (result.success) {
      onSuccess(result.data);
      onClose();
    } else {
      setErrors({ submit: result.error });
    }
    
    setIsLoading(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Novo Agendamento"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} isLoading={isLoading}>
            Criar
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormSelect
          name="client_id"
          label="Cliente"
          options={clients}
          value={formData.client_id}
          onChange={(e) => setFormData({...formData, client_id: e.target.value})}
          error={errors.client_id}
          required
        />
        {/* ... mais fields */}
      </form>
    </Modal>
  );
}
```

---

## FASE 4: INTEGRAÇÃO + POLISH (Frontend SENIOR)

### 4.1 - Integrar Modal + Pagination em todas páginas (2h)

**Checklist**:
- [ ] DeleteConfirmationModal em botões delete (4 ações por página)
- [ ] Pagination em table footer (5 páginas)
- [ ] Create/Edit modals nos botões Action (5 páginas)

### 4.2 - Adicionar Loading States + Error Handling (1h)

**Padrão**:
```typescript
if (isLoading) return <TableSkeleton />;
if (error) return <ErrorState message={error} />;
if (data.length === 0) return <EmptyState />;
```

### 4.3 - Toast Notifications para todas ações (1h)

```typescript
const toast = useToast();

// Após criar
toast.success("Agendamento criado com sucesso!");

// Após deletar
toast.success("Agendamento deletado");

// Após error
toast.error(result.error);
```

---

## FASE 5: TESTING (QA SENIOR)

### 5.1 - Unit Tests para UseCases (3h)
- Appointment validation tests
- Client duplicate prevention
- Service duration validation
- etc.

### 5.2 - E2E Tests (5h)
- Flow: Create appointment → Verify in list → Edit → Delete
- Flow: Create client → Create appointment for client
- etc.

### 5.3 - Integration Tests (2h)
- Multi-tenant isolation
- RLS enforcement
- Data persistence

---

## 📊 EXECUTION TIMELINE

```
SEMANA 1
├─ SEG-TER: Fase 1 (UX Design) - 6h
├─ TER-QUI: Fase 2.1-2.3 (Backend) - 13h
└─ QUI-SEX: Fase 2 finalização + testes

SEMANA 2
├─ SEG-TER: Fase 3.1-3.2 (Form Components) - 4h
├─ TER-SEX: Fase 3.3 (Page Refactoring) - 8h
└─ SEX: Fase 3.4 (Modals) - 3h

SEMANA 3
├─ SEG-TER: Fase 4 (Polish) - 4h
├─ TER-SEX: Fase 5 (Testing) - 10h
└─ SEX: Buffer + Fixes

TOTAL: 50-66 horas de work (2 semanas FTE)
```

---

## 🎯 SUCCESS CRITERIA - POR FASE

### FASE 1: UX Design ✅
- [ ] Figma file com 5+ page variants
- [ ] Form components Figma library
- [ ] Modal variations (delete, create, edit, view)
- [ ] Loading/Empty/Error states
- [ ] Code Connect mappings criadas

### FASE 2: Backend ✅
- [ ] 5 repositories com limit/offset
- [ ] 5 UseCases completos com validações
- [ ] 20 server actions (CRUD)
- [ ] Unit tests passando (NEW: 20+ testes)
- [ ] Build passing sem erros

### FASE 3: Frontend ✅
- [ ] FormInput, FormSelect, FormMultiSelect, DatePicker, TimePicker, Textarea
- [ ] DeleteConfirmationModal reutilizável
- [ ] 5 modais de Create (Appointment, Client, Service, Employee, Room)
- [ ] 5 páginas refatoradas (mockData → server actions)
- [ ] Pagination em todas tabelas
- [ ] Delete buttons funcionando
- [ ] Edit buttons funcionando

### FASE 4: Polish ✅
- [ ] Loading states em todas páginas
- [ ] Empty states em todas páginas
- [ ] Error messages inline e toast
- [ ] Optimistic updates (se necessário)

### FASE 5: Testing ✅
- [ ] 30+ unit tests (UseCases)
- [ ] 15+ E2E tests (Playwright)
- [ ] 5+ integration tests
- [ ] Test coverage: 70%+
- [ ] All tests passing

---

## 🚚 DELIVERABLES POR FASE

| Fase | Deliverables | Formato | Owner |
|------|--------------|---------|-------|
| 1 | Figma file + Code Connect | .fig | UX Senior |
| 2 | Updated repos, UseCases, Server Actions | GitHub | Backend Senior |
| 3 | Form components, Modals, Refactored pages | GitHub | Frontend Senior |
| 4 | Polish + optimizations | GitHub | Frontend Senior |
| 5 | Test files + coverage report | GitHub | QA Senior |

---

## ⚠️ RISCOS + MITIGAÇÕES

| Risco | Probabilidade | Mitigação |
|-------|---------------|-----------|
| Server Actions + Client imports crash | Média | Use "use server" em actions.ts, test imports early |
| Validation conflicts (client vs server) | Média | Documentar rules, shared utils |
| Modal/form state management chaos | Baixa | Use Context ou custom hooks |
| Performance queries lentas | Média | Add índices, test com dados reais |
| Email/auth validations complexas | Baixa | Usar Zod + server-side double-check |

---

## 📋 CHECKLIST ANTES DE COMEÇAR

- [ ] Equipe alinhada nas 3 fases
- [ ] UX Senior conhece o design system (Figma access)
- [ ] Backend Senior tem acesso ao Supabase
- [ ] Frontend Senior entende Repository pattern
- [ ] QA Senior tem Playwright setup
- [ ] Ambiente dev funcionando (npm run dev, npm run build)
- [ ] Database migrations prontas (clinics table exists)
- [ ] .env.local com Supabase keys

---

## 🎯 PRÓXIMOS PASSOS

1. **HOJE**: Arquiteto + Time review este plano
2. **AMANHÃ**: Alocar UX Senior para Figma (6-8h)
3. **DIA DEPOIS**: Backend Senior começa repositories (4h)
4. **Paralelo**: Frontend Senior estuda Form patterns (2h prep)
5. **Semana 2**: Full execution

---

**DOCUMENT OWNER**: Senior Engineer  
**APPROVED BY**: Architecture Team (pending)  
**STATUS**: Ready for execution  
**ESTIMATED COMPLETION**: 21 dias calendar (14 dias work FTE)
