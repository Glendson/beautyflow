# 🚨 CRÍTICO: Email Confirmation Configuration

## Status do Problema
- ❌ Supabase Cloud está rejeitando novos emails  
- 🔴 Reason: "Email Confirmations Required" está ativado por padrão
- 📈 Rate limiting: Bloqueia múltiplas tentativas com domínios/emails inválidos

## Solução Requerida (Manual no Dashboard)

### PASSO 1: Acessar Supabase Dashboard
Abra: https://app.supabase.com/project/epkkwyrebbsyeougwswd/settings/auth

### PASSO 2: Desabilitar Email Confirmations
1. Procure por **"Email Confirmations"** 
2. Encontre a opção **"Require email confirmation to sign up"**
3. Clique em **OFF/DISABLE**
4. Salve as mudanças

### PASSO 3: Volte e rode os testes

## Screenshot de Onde Encontrar

```
Supabase Dashboard
  ↓
Project Settings (ícone ⚙️)
  ↓
Auth (abas esquerda)
  ↓
Providers → Email
  ↓
Toggle OFF: "Require email confirmation to sign up"
```

## Alternativa se não conseguir:

Use nosso admin bypass que está implementado:
1. Adicione `SUPABASE_SERVICE_ROLE_KEY` ao `.env.local`
2. Faça deploy

O código já tenta usar admin client automaticamente.

## Arquivo de Referência
- `src/lib/auth-admin.ts` - Admin bypass implementation
- `src/application/auth/AuthUseCase.ts` - Updated to use admin bypass

---

**Status:** Aguardando desabilitação manual no Supabase Dashboard
