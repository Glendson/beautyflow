# 🎯 SOLUÇÃO RÁPIDA: Escolha 1 Opção para Desbloquear Testes

## 📊 Resumo das Opções

| Opção | Tempo | Dificuldade | Resultado |
|-------|-------|-------------|-----------|
| **A** - Desabilitar Email Confirmations | 1 min | ⭐ Fácil | ✅ Signup funciona para qualquer novo email |
| **B** - Executar SQL Manual | 2 min | ⭐⭐ Médio | ✅ Usuário de teste criado, sem confirmação necessária |
| **C** - Usar Admin Seed Script | 3 min | ⭐ Fácil | ✅ Script automático faz tudo |


---

## OPÇÃO A: Desabilitar Email Confirmations ⭐ RECOMENDADO

**Melhor para:** Testes rápidos, ambiente de desenvolvimento

### Passo a Passo:

1. Abra: https://app.supabase.com/project/epkkwyrebbsyeougwswd/settings/auth

2. Na aba **Auth Providers**, procure por **Email**

3. Procure a opção: **"Require email confirmation to sign up"**

4. Clique no toggle para **OFF** (desabilitar)

5. Salve as mudanças

6. **Volta na sua terminal e rode:**
   ```bash
   npx playwright test e2e/qa-full-test.spec.ts --project=chromium
   ```

### ✅ Resultado Esperado:
- Signup aceita qualquer email válido
- Sem delay de confirmação
- Todos os 10 testes passam

---

## OPÇÃO B: Executar SQL Manual

**Melhor para:** Teste único + manter email confirmation ativado

### Passo a Passo:

1. Abra: https://app.supabase.com/project/epkkwyrebbsyeougwswd/sql/new

2. Delete tudo e copie isto:
```sql
-- Create test user directly (bypasses email confirmation)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  last_sign_in_at,
  confirmation_token,
  recovery_token,
  email_change_token,
  phone_change_token
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'qa-test@example.com',
  crypt('QATest@123!', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now(),
  now(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Get the user ID
WITH user_id AS (
  SELECT id FROM auth.users WHERE email = 'qa-test@example.com'
)
-- Create clinic
INSERT INTO public.clinics (name, slug)
SELECT 'QA Test Clinic', 'qa-test-' || substring(user_id.id::text, 1, 8)
FROM user_id
ON CONFLICT (slug) DO NOTHING
RETURNING id;

-- Link user to clinic
WITH user_data AS (
  SELECT id FROM auth.users WHERE email = 'qa-test@example.com'
),
clinic_data AS (
  SELECT id FROM public.clinics WHERE slug LIKE 'qa-test-%' ORDER BY created_at DESC LIMIT 1
)
INSERT INTO public.user_profiles (id, clinic_id, first_name, last_name, role)
SELECT user_data.id, clinic_data.id, 'QA', 'Tester', 'admin'
FROM user_data, clinic_data
ON CONFLICT (id) DO UPDATE SET clinic_id = EXCLUDED.clinic_id;
```

3. Clique **Run** (▶️) no topo

4. Volta na sua terminal:
```bash
npx playwright test e2e/qa-full-test.spec.ts --project=chromium
```

### ✅ Credenciais:
- **Email:** qa-test@example.com
- **Senha:** QATest@123!

---

## OPÇÃO C: Usar Admin Seed Script (Automático)

**Melhor para:** Ambiente com SERVICE_ROLE_KEY configurado

### Passo a Passo:

1. **Obter SERVICE_ROLE_KEY:**
   - Abra: https://app.supabase.com/project/epkkwyrebbsyeougwswd/settings/api
   - Procure por **"Service Role"** (NÃO é a PUBLIC KEY)
   - Copie o token `eyJhbGc...`

2. **Adicionar ao .env.local:**
   ```
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```

3. **Executar script:**
   ```bash
   npx tsx supabase/admin-seed.ts
   ```

4. **Rodar testes:**
   ```bash
   npm run test:e2e
   ```

### ✅ Resultado:
- Script cria usuário automaticamente
- Reutilizável para múltiplos testes
- Profile criado corretamente

---

## 🚀 RECOMENDAÇÃO

**USE OPÇÃO A** (30 segundos):
1. Abra dashboard Supabase
2. Desabilite "Require email confirmation to sign up"
3. Pronto! Testes desblqueados

**Depois rode:**
```bash
npx playwright test e2e/qa-full-test.spec.ts --project=chromium --headed
```

---

## Se Falhar em Qualquer Opção

Execute isto para resetar rate limit:
```bash
# Aguarde 1 hora, ou delete a conta no Supabase Dashboard:
# https://app.supabase.com/project/epkkwyrebbsyeougwswd/auth/users
# Delete a conta 'qa-test@example.com' e tente novamente
```

---

**Status:** Escolha 1 opção acima e execute. Depois execute: `npm run test:e2e`
