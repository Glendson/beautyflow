# 🔐 Auditoria da Estrutura de Autenticação - BeautyFlow

## Resumo Executivo
A estrutura de autenticação está **bem organizada com DDD**, mas tem **POTENCIAIS PROBLEMAS** em:
1. ✅ JWT é criado e armazenado corretamente via trigger
2. ⚠️ Middleware está deprecado (usando `proxy.ts` corretamente, mas arquivo antigo existe)
3. ✅ Proteção de rotas funciona
4. ✅ Server actions implementadas corretamente
5. ⚠️ **Problema crítico**: `clinic_id` pode não estar disponível IMEDIATAMENTE após signup/login

---

## 📁 Arquivos Encontrados e Funções

### 1. **Autenticação - Server Actions**
📍 [src/app/(auth)/actions.ts](src/app/(auth)/actions.ts)

**Função:** Server actions centralizadas para login, signup e logout

**Fluxo:**
```
loginAction(email, password)
  ↓
  AuthUseCase.signIn()
    ↓
    Supabase.auth.signInWithPassword()
      ↓
      getClinicId() → Verifica se clinic_id existe no JWT
        ↓
        redirect("/dashboard")
```

**Problemas Óbvios:**
```typescript
// ❌ PROBLEMA 1: getClinicId() é chamado APÓS signin
const clinicId = await getClinicId();
if (!clinicId) {
  return Result.fail("User authenticated but clinic information not found...");
}

// ⚠️ Possível race condition:
// - Usuário se autentica
// - Trigger PostgreSQL ainda está processando
// - getClinicId() retorna null
// - Redirect não acontece, mas signup foi bem-sucedido!
```

---

### 2. **Autenticação - Use Case**
📍 [src/application/auth/AuthUseCase.ts](src/application/auth/AuthUseCase.ts)

**Função:** Lógica de domínio para signup/signin/signout

**Fluxo detalhado do SignUp:**

```typescript
async signUp(email, password, clinicName, firstName, lastName) {
  // 1. Cria usuário no Supabase Auth
  const authData = await supabase.auth.signUp({ email, password })
  
  // 2. Faz login imediatamente para estabelecer sessão
  await supabase.auth.signInWithPassword({ email, password })
  
  // 3. Gera slug da clínica
  const clinicSlug = clinicName.toLowerCase() + "-" + random()
  
  // 4. Chama RPC register_clinic que:
  //    - Cria clinic no DB
  //    - Cria user_profile no DB
  //    - TRIGGER: handle_new_user_clinic() atualiza JWT
  const clinicId = await supabase.rpc("register_clinic", {...})
}
```

**Problemas Óbvios:**
```typescript
// ❌ PROBLEMA 2: Sem esperança pelo trigger
// Após signInWithPassword(), o sessão está estabelecida,
// MAS o app_metadata pode não estar refrescado ainda

// ⚠️ A RPC retorna clinicId, mas é perdido em signupAction():
// Em AuthUseCase.ts:
return Result.ok({ clinicId: clinicId as string })

// Em actions.ts:
const result = await AuthUseCase.signUp(...)
if (result.success) {
  const clinicId = await getClinicId()  // ← Consultando de novo, em vez de usar result.clinicId
}
```

---

### 3. **Autenticação - Auth.ts (Client Utilities)**
📍 [src/lib/auth.ts](src/lib/auth.ts)

**Função:** Utilitário para extrair `clinic_id` do JWT

```typescript
export async function getClinicId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const clinicId = user.app_metadata?.clinic_id;
  return clinicId ? String(clinicId) : null;
}
```

**Problemas Óbvios:**
```typescript
// ❌ PROBLEMA 3: Sem refresh do token
// Se o app_metadata foi atualizado 50ms atrás mas não foi refrescado,
// supabase.auth.getUser() retorna o JWT cached/stale

// Não há chamada para:
await supabase.auth.refreshSession()
```

---

### 4. **Middleware - Proteção de Rotas**
📍 [src/infrastructure/supabase/middleware.ts](src/infrastructure/supabase/middleware.ts)

**Função:** Middleware SSR que protege rotas e redireciona usuários não autenticados

```typescript
export async function updateSession(request: NextRequest) {
  const supabase = createServerClient(...)
  const { data: { user } } = await supabase.auth.getUser()
  
  // Determina se é rota auth ou pública
  const isAuthRoute = pathname.startsWith('/login') || startsWith('/signup')
  const isPublicRoute = pathname === '/' || isAuthRoute
  
  // Protege rotas privadas
  if (!user && !isPublicRoute) {
    return redirect('/login')
  }
  
  // Evita loop de autenticados em login/signup
  if (user && isAuthRoute) {
    return redirect('/dashboard')
  }
}
```

**Problemas Óbvios:**
```
✅ Lógica correta
✅ Redireciona para /login se não autenticado
✅ Redireciona para /dashboard se autenticado tentando acessar auth
```

**Deprecation Notice:**
```
⚠️ PROBLEMA 4: Arquivo "middleware" está deprecado no Next.js moderno
  - O projeto CORRETAMENTE usa src/proxy.ts
  - Que chama updateSession() do middleware.ts
  - Mas o arquivo ainda existe e é indicativo de config antigo
```

---

### 5. **Proxy (Next.js moderne middleware)**
📍 [src/proxy.ts](src/proxy.ts)

**Função:** Novo padrão Next.js para middleware (substitui middleware.ts)

```typescript
export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

**Status:**
```
✅ Implementado corretamente
✅ Matcher cobre todas as rotas menos assets
✅ Chama updateSession (do middleware.ts)
```

---

### 6. **Criação da Clínica - RPC Function**
📍 [supabase/migrations/20260320164500_signup_rpc.sql](supabase/migrations/20260320164500_signup_rpc.sql)

**Função:** Stored Procedure do PostgreSQL que atomicamente cria clínica + perfil de usuário

```sql
CREATE OR REPLACE FUNCTION public.register_clinic(
  clinic_name TEXT, 
  clinic_slug TEXT, 
  first_name TEXT, 
  last_name TEXT
) RETURNS UUID AS $$
DECLARE
  new_clinic_id UUID;
BEGIN
  -- Verifica se está autenticado
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- 1. Cria clínica
  INSERT INTO public.clinics (name, slug)
  VALUES (clinic_name, clinic_slug)
  RETURNING id INTO new_clinic_id;

  -- 2. Cria perfil do usuário (associa user_id com clinic_id)
  INSERT INTO public.user_profiles (id, clinic_id, first_name, last_name, role)
  VALUES (auth.uid(), new_clinic_id, first_name, last_name, 'admin');

  RETURN new_clinic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Status:**
```
✅ Atomicidade garantida
✅ Segurança via SECURITY DEFINER
✅ Valida autenticação
```

---

### 7. **JWT Claims - Trigger que popula clinic_id**
📍 [supabase/migrations/20260320164000_auth_claims_trigger.sql](supabase/migrations/20260320164000_auth_claims_trigger.sql)

**Função:** Trigger que AUTOMATICAMENTE atualiza o JWT com clinic_id quando user_profile é criado

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user_clinic()
RETURNS TRIGGER AS $$
BEGIN

  -- Pega o clinic_id do novo user_profile
  -- Adiciona ao raw_app_meta_data do auth.users (JWT)
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('clinic_id', NEW.clinic_id)
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_user_profile_created
  AFTER INSERT ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_clinic();
```

**Status:**
```
✅ Implementado corretamente
✅ Atualiza raw_app_meta_data (JWT metadata)
✅ Merges com metadados existentes usando ||
```

**⚠️ PROBLEMA 5: Timing Issue**
```
A trigger é ASYNC, pode haver delay:
1. signup() cria user_profile
2. Trigger que atualiza JWT é enfileirado
3. Imediatamente depois, getClinicId() é chamado
4. JWT ainda não foi atualizado!
```

---

### 8. **Dashboard - Proteção**
📍 [src/app/(dashboard)/layout.tsx](src/app/(dashboard)/layout.tsx)

**Função:** Layout do dashboard (protegido por middleware)

```typescript
"use client";

// Nota: Usa "use client" mas não há Auth Provider aqui
// Proteção é feita pelo middleware (não por Context)
```

**Status:**
```
✅ Protegido pelo middleware
⚠️ Sem Context de Auth para componentes acessarem clinic_id
   - Cada componente precisa chamar getClinicId() individualmente
   - Dificulta acesso a dados do usuário autenticado
```

---

### 9. **Páginas de Signup e Login**
📍 [src/app/(auth)/signup/page.tsx](src/app/(auth)/signup/page.tsx)  
📍 [src/app/(auth)/login/page.tsx](src/app/(auth)/login/page.tsx)

**Função:** UI para autenticação

**Status:**
```
✅ Client components corretos
✅ Capturam FormData e passam para server actions
✅ Tratam erros e loading states
✅ Redirecionam após sucesso via redirect() na action
```

---

## 🚨 Problemas Identificados

### CRÍTICO 🔴
| # | Problema | Severidade | Impacto | Solução |
|---|----------|-----------|---------|---------|
| 1 | `getClinicId()` sem refresh de sessão | CRÍTICO | Pode retornar null por timing race condition | `await supabase.auth.refreshSession()` antes de `getUser()` |
| 2 | Trigger do JWT é async | CRÍTICO | Pequeno delay entre signup e JWT estar pronto | Implementar polling/retry com timeout |
| 3 | `clinicId` da RPC não é usado | CRÍTICO | Consulta redundante ao JWT em vez de usar valor retornado | Usar `result.clinicId` em signupAction |

### MÉDIO 🟡
| # | Problema | Severidade | Impacto | Solução |
|---|----------|-----------|---------|---------|
| 4 | Sem Auth Context/Provider | MÉDIO | Componentes precisam de `getClinicId()` individual | Criar AuthContext + useAuth hook |
| 5 | Arquivo middleware.ts is deprecated | MÉDIO | Build warning, confusão para futuros devs | Mover lógica/remover arquivo antigo (já usando proxy.ts) |

### MENOR 🟢
| # | Problema | Severidade | Impacto | Solução |
|---|----------|-----------|---------|---------|
| 6 | Sem tratamento de erro de JWT inválido | MENOR | UX ruim se JWT corromper | Adicionar fallback redirect /login |

---

## 🔄 Fluxo Completo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│ USER: Acessa /signup                                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
         ┌────────────────────────────────┐
         │ proxy/middleware intercepta    │
         │ - Procura user no JWT          │
         │ - Se existe → redirect /dash   │
         │ - Se não → permite /signup     │
         └────────────────────┬───────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │ SignupPage (Client Component) │
              │ - Form com firstName, etc     │
              │ - onSubmit → signupAction()   │
              └─────────────────┬─────────────┘
                                │
                                ▼
           ┌──────────────────────────────────────────┐
           │ SERVER ACTION: signupAction()           │
           │ - Valida FormData                       │
           │ - Chama AuthUseCase.signUp()            │
           └─────────────┬──────────────┬────────────┘
                         │              │
         ┌───────────────▼──┐   ┌───────▼──────────────┐
         │ supabase.auth    │   │ PostgreSQL RPC       │
         │ .signUp()        │   │ register_clinic()    │
         │                  │   │                      │
         │ 2. signIn()      │   │ 3. INSERT clinic     │
         │ (establece       │   │ 4. INSERT user_prof  │
         │  sessão)         │   │ 5. RETURN clinic_id  │
         └──────────────────┘   └──────────┬───────────┘
                                           │
                                           ▼
                        ┌──────────────────────────────────┐
                        │ PostgreSQL TRIGGER:              │
                        │ handle_new_user_clinic()         │
                        │                                  │
                        │ UPDATE auth.users SET            │
                        │   raw_app_meta_data =            │
                        │   {...clinic_id...}              │
                        │                                  │
                        │ ⚠️ ASYNC - Pode ter delay!      │
                        └──────────────┬───────────────────┘
                                       │
                 ┌─────────────────────┴──────────────────┐
                 │                                        │
                 ▼                                        ▼
         ┌──────────────────┐                   ┌────────────────┐
         │ ✅ Via clinicId  │                   │ ❌ Problema!   │
         │ returned from    │                   │ Chama           │
         │ RPC (disponível) │                   │ getClinicId()   │
         │                  │                   │ mas JWT stale!  │
         │ Deveria usar:    │                   │                │
         │ result.clinicId  │                   │ Solução:       │
         └──────────────────┘                   │ refresh token  │
                                                └────────────────┘
                                                        │
                                                        ▼
                                        ┌───────────────────────┐
                                        │ getClinicId()         │
                                        │ (com refresh)         │
                                        │ → Returns: clinic-id  │
                                        └───────────┬───────────┘
                                                    │
                                                    ▼
                                        ┌───────────────────────┐
                                        │ redirect("/dashboard")│
                                        └───────────┬───────────┘
                                                    │
                                                    ▼
                 ┌──────────────────────────────────────────┐
                 │ proxy/middleware intercepta /dashboard  │
                 │ - JWT tem clinic_id                     │
                 │ - Usuário autenticado ✅               │
                 │ - Permite acesso                        │
                 └──────────────────────────────────────────┘
```

---

## 🧪 Testes Relacionados

📍 [src/tests/integration/multiTenancy.spec.ts](src/tests/integration/multiTenancy.spec.ts)
- Verifica isolamento de clínicas
- Testa RLS policies
- Valida clinic_id em JWT

📍 [src/tests/unit/AuthUseCase.spec.ts](src/tests/unit/AuthUseCase.spec.ts)
- Testes de signup/signin
- Failing scenarios

📍 [e2e/auth.spec.ts](e2e/auth.spec.ts)
- Testes end-to-end

---

## 📋 Checklist de Correções

### Prioridade 1️⃣ (CRÍTICO)
- [ ] Adicionar `supabase.auth.refreshSession()` em `getClinicId()`
- [ ] Implementar retry/polling para timezone do trigger JWT
- [ ] Usar `result.clinicId` em signupAction em vez de chamar getClinicId() de novo

### Prioridade 2️⃣ (MÉDIO)
- [ ] Criar `AuthContext` + `useAuth()` hook
- [ ] Deprecate arquivo `src/infrastructure/supabase/middleware.ts` (movido para proxy.ts)

### Prioridade 3️⃣ (MENOR)
- [ ] Adicionar tratamento de JWT inválido
- [ ] Melhorar error messages

---

## 🔗 Dependências de Arquivos

```
signupAction() (actions.ts)
    ↓
    AuthUseCase.signUp() (AuthUseCase.ts)
        ↓
        supabase.rpc("register_clinic") ← RPC (signup_rpc.sql)
            ↓
            Trigger: handle_new_user_clinic() ← (auth_claims_trigger.sql)
                ↓
                Updates auth.users raw_app_meta_data with clinic_id
                ↓
    After RPC returns, getClinicId() (auth.ts)
        ↓
        supabase.auth.getUser() ← Gets JWT with clinic_id
            ↓
            redirect("/dashboard")
                ↓
                proxy/middleware checks auth
                ↓
                permite acesso ✅
```

---

**Gerado em:** 23 de março de 2026  
**Conclusão:** Estrutura bem projetada mas com **timing issues críticos** que precisam de correção.
