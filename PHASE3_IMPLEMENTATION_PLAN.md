# 🚀 PHASE 3 - FORM COMPONENTS E REFACTORING DE PAGES

**Data Início**: 3 de abril de 2026  
**Duração Estimada**: 18-22 horas (3-4 dias de trabalho)  
**Status**: INICIANDO

---

## 📋 VISÃO GERAL

Phase 3 é o último grande ciclo antes de testes E2E. Foca em:

1. **Form Components** (6-8 horas)
   - Criar componentes reutilizáveis de formulário
   - Integrar com React Hook Form (se necessário)
   - Validações client-side
   
2. **Modal Components** (4-6 horas)
   - Delete confirmation dialog
   - Create/Edit modals para cada entidade (5 modais)
   - State management simples
   
3. **Page Refactoring** (8-12 horas)
   - Integrar server actions em cada page
   - Remover mockData
   - Implementar loading states
   - Add error handling + toasts
   - Wire up pagination com UI component

---

## 🎯 PHASE 3.1 - FORM COMPONENTS

### Objetivo
Criar uma biblioteca reutilizável de componentes de formulário com validação integrada.

### Componentes a Criar

```
src/components/forms/
├── FormInput.tsx          (input text, email, number, password)
├── FormSelect.tsx         (dropdown com type-safe options)
├── FormCheckbox.tsx       (checkbox com label)
├── FormTextarea.tsx       (textarea com character count)
├── FormDatePicker.tsx     (date input com calendar)
├── FormTimePicker.tsx     (time input com spinner)
├── FormMultiSelect.tsx    (select múltiplo - para services)
└── index.ts              (exports)
```

### Características

**FormInput**
```typescript
interface FormInputProps {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'number' | 'password' | 'tel';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}
```

**FormSelect**
```typescript
interface FormSelectProps<T> {
  name: string;
  label: string;
  options: { value: T; label: string }[];
  value?: T;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange?: (value: T) => void;
}
```

**FormDatePicker**
```typescript
interface FormDatePickerProps {
  name: string;
  label: string;
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  required?: boolean;
  error?: string;
  onChange?: (date: Date) => void;
}
```

### Design Decisions

- ✅ Usar Tailwind CSS (já no projeto)
- ✅ Controlled components (via props value/onChange)
- ✅ Sem dependência de React Hook Form (manter simples)
- ✅ Accessibility: labels, aria-invalid, aria-describedby
- ✅ Error messages inline + styled em vermelho

---

## 🎯 PHASE 3.2 - MODAL COMPONENTS

### Objetivo
Criar modais reutilizáveis para criar, editar, deletar entidades.

### Componentes a Criar

```
src/components/modals/
├── DeleteConfirmationModal.tsx    (genérico para qualquer entidade)
├── CreateAppointmentModal.tsx      (appointment create)
├── EditAppointmentModal.tsx        (appointment edit)
├── CreateClientModal.tsx           (client create)
├── EditClientModal.tsx             (client edit)
├── CreateServiceModal.tsx          (service create)
├── EditServiceModal.tsx            (service edit)
├── CreateEmployeeModal.tsx         (employee create)
├── EditEmployeeModal.tsx           (employee edit)
├── CreateRoomModal.tsx             (room create)
├── EditRoomModal.tsx               (room edit)
└── index.ts                        (exports)
```

### DeleteConfirmationModal

```typescript
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  entityName: string; // "Appointment", "Client", etc.
  isLoading?: boolean;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDangerous?: boolean; // Red button para ações críticas
}
```

### CreateAppointmentModal (exemplo)

```typescript
interface CreateAppointmentModalProps {
  isOpen: boolean;
  clients: Client[];
  services: Service[];
  employees: Employee[];
  rooms: Room[];
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
}
```

Conteúdo do modal:
- FormSelect: Cliente
- FormSelect: Serviço
- FormSelect: Funcionário
- FormSelect: Sala (opcional)
- FormDatePicker: Data
- FormTimePicker: Hora início
- FormTimePicker: Hora fim
- Botões: Cancelar / Criar

---

## 🎯 PHASE 3.3-3.7 - PAGE REFACTORING

### Padrão de Refactoring

Cada página segue este padrão:

**Antes** (com mockData):
```tsx
const [appointments, setAppointments] = useState(mockData);
```

**Depois** (com server actions):
```tsx
'use client';

const [appointments, setAppointments] = useState<Appointment[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize] = useState(10);
const [totalPages, setTotalPages] = useState(1);

useEffect(() => {
  loadAppointments();
}, [currentPage]);

async function loadAppointments() {
  setIsLoading(true);
  const result = await listAppointmentsAction(currentPage, pageSize);
  if (result.success) {
    setAppointments(result.data.data);
    setTotalPages(result.data.totalPages);
  } else {
    showErrorToast(result.error);
  }
  setIsLoading(false);
}
```

### Appointments Page (`/appointments`)

**Mudanças**:
1. Remove mockData
2. Adiciona useEffect para load via `listAppointmentsAction`
3. Adiciona estado para pagination
4. Integra CreateAppointmentModal
5. Integra EditAppointmentModal
6. Integra DeleteConfirmationModal
7. Conecta actions aos botões
8. Add loading skeleton
9. Add error boundary

**Status Actions Necessários**:
- UpdateAppointmentStatusAction (completed, canceled, no_show)
- Botões inline para mudar status

### Clients Page (`/clients`)

**Mudanças**:
1. Remove mockData
2. Adiciona useEffect para load via `listClientsAction`
3. Integra CreateClientModal
4. Integra EditClientModal
5. Integra DeleteConfirmationModal
6. Pagination support
7. Search filter integration
8. Loading + error states

### Services Page (`/services`)

**Mudanças**:
1. Remove mockData
2. Integra `listServicesAction`
3. Adiciona CreateServiceModal
4. Adiciona EditServiceModal
5. Category filter mantém-se funcional
6. Pagination
7. isActive toggle (inline action)

### Employees Page (`/employees`)

**Mudanças**:
1. Remove mockData
2. Integra `listEmployeesAction`
3. Adiciona CreateEmployeeModal com service assignment
4. Adiciona EditEmployeeModal com service assignment
5. DeleteConfirmationModal
6. Loading + error states
7. Pagination

### Rooms Page (`/rooms`)

**Mudanças**:
1. Remove mockData
2. Integra `listRoomsAction`
3. Adiciona CreateRoomModal (type: room | station)
4. Adiciona EditRoomModal
5. Type filter mantém-se funcional
6. Pagination
7. Status deletion inline

---

## 🛠️ IMPLEMENTAÇÃO STRATEGY

### Fase A: Form Components (6 horas)
1. FormInput ← Comece aqui (base)
2. FormSelect
3. FormCheckbox
4. FormTextarea
5. FormDatePicker
6. FormTimePicker
7. FormMultiSelect
8. Testes: verificar visual + funcionalidade

### Fase B: Modal Components (5 horas)
1. DeleteConfirmationModal ← Padrão único
2. CreateAppointmentModal
3. EditAppointmentModal
4. CreateClientModal + EditClientModal
5. CreateServiceModal + EditServiceModal
6. CreateEmployeeModal + EditEmployeeModal
7. CreateRoomModal + EditRoomModal
8. Testes: integração com server actions

### Fase C: Page Refactoring (10 horas)
1. Appointments page (+ integration tests)
2. Clients page
3. Services page
4. Employees page
5. Rooms page
6. Build + full test suite

---

## ✅ CHECKLIST DE CONCLUSÃO

### Form Components
- [ ] FormInput implementado + tested
- [ ] FormSelect implementado
- [ ] FormDatePicker implementado
- [ ] FormTimePicker implementado
- [ ] FormTextarea implementado
- [ ] FormCheckbox implementado
- [ ] FormMultiSelect implementado
- [ ] Accessibility (labels, aria-*)
- [ ] Error message styling
- [ ] Build passing

### Modal Components
- [ ] DeleteConfirmationModal implementado
- [ ] Appointments modals (create + edit)
- [ ] Clients modals (create + edit)
- [ ] Services modals (create + edit)
- [ ] Employees modals (create + edit)
- [ ] Rooms modals (create + edit)
- [ ] State management funcional
- [ ] Server action integration
- [ ] Build passing

### Page Refactoring
- [ ] Appointments page refatorada
- [ ] Clients page refatorada
- [ ] Services page refatorada
- [ ] Employees page refatorada
- [ ] Rooms page refatorada
- [ ] Pagination funcional em todas
- [ ] Filtros funcionais
- [ ] Loading states
- [ ] Error boundary + error messages
- [ ] Build passing
- [ ] Unit tests passing

---

## 📊 ESTIMATIVA DE TEMPO

| Tarefa | Tempo | Dependências |
|---|---|---|
| FormInput | 1h | - |
| FormSelect | 1.5h | FormInput |
| FormDatePicker | 1.5h | FormInput |
| FormTimePicker | 1h | FormInput |
| FormTextarea | 0.5h | FormInput |
| FormCheckbox | 0.5h | FormInput |
| FormMultiSelect | 1h | FormSelect |
| Sub Total Form | **7h** | |
| DeleteConfirmationModal | 1h | - |
| Appointment Modals | 1.5h | Form + Modal |
| Client Modals | 1.5h | Form + Modal |
| Service Modals | 1.5h | Form + Modal |
| Employee Modals | 1.5h | Form + Modal |
| Room Modals | 1h | Form + Modal |
| Sub Total Modal | **7h** | Form Components |
| Appointments Page | 2h | Modals |
| Clients Page | 2h | Modals |
| Services Page | 2h | Modals |
| Employees Page | 2h | Modals |
| Rooms Page | 2h | Modals |
| Sub Total Refactor | **10h** | Modals |
| **TOTAL** | **24h** | - |

---

## 🚀 PRÓXIMOS PASSOS

1. ✅ Começar Phase 3.1 (Form Components)
   - Criar `src/components/forms/` directory
   - Implementar FormInput como base
   - Build + test visual

2. Depois de Fase A → Fase B (Modals)
3. Depois de Fase B → Fase C (Pages)
4. Depois de Fase C → Phase 4 (Testing + Polishing)

---

**Nota**: Este é um plano vivo e pode ser ajustado conforme necessário. Recomenda-se trabalhar em fases menores para manter momentum e validação contínua.
