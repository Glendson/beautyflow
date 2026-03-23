-- Migration: Corrige RLS para usar user_profiles e atualiza register_clinic
-- Generated: 2026-03-23

-- 1) Dropar todas as policies existentes em cada tabela alvo
DO $$DECLARE r record; BEGIN
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clients' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.clients', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'appointments' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.appointments', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'employees' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.employees', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'services' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.services', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'rooms' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.rooms', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'clinics' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.clinics', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'user_profiles' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.user_profiles', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'service_categories' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.service_categories', r.policyname);
  END LOOP;
  FOR r IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = 'employee_services' LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.employee_services', r.policyname);
  END LOOP;
END$$;

-- 2) Garantir RLS habilitado nas tabelas alvo
ALTER TABLE IF EXISTS public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.employee_services ENABLE ROW LEVEL SECURITY;

-- 3) Criar policies novas que usam user_profiles (auth.uid())

-- clients
CREATE POLICY "Tenant isolation for clients" ON public.clients
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1))
  WITH CHECK (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- appointments
CREATE POLICY "Tenant isolation for appointments" ON public.appointments
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1))
  WITH CHECK (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- employees
CREATE POLICY "Tenant isolation for employees" ON public.employees
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1))
  WITH CHECK (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- services
CREATE POLICY "Tenant isolation for services" ON public.services
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1))
  WITH CHECK (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- rooms
CREATE POLICY "Tenant isolation for rooms" ON public.rooms
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1))
  WITH CHECK (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- clinics (users can only select/update clinic that matches their profile)
CREATE POLICY "Tenant isolation for clinics" ON public.clinics
  FOR ALL
  USING (id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1))
  WITH CHECK (id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- user_profiles
CREATE POLICY "Tenant isolation for user_profiles: select" ON public.user_profiles
  FOR SELECT
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1) OR id = auth.uid());

CREATE POLICY "Tenant isolation for user_profiles: insert" ON public.user_profiles
  FOR INSERT
  WITH CHECK (id = auth.uid());

CREATE POLICY "Tenant isolation for user_profiles: update_delete" ON public.user_profiles
  FOR UPDATE, DELETE
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1) OR id = auth.uid())
  WITH CHECK (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1) OR id = auth.uid());

-- service_categories
CREATE POLICY "Tenant isolation for service_categories" ON public.service_categories
  USING (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1))
  WITH CHECK (clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1));

-- employee_services: associada via employee -> clinic
CREATE POLICY "Tenant isolation for employee_services" ON public.employee_services
  USING (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = public.employee_services.employee_id
        AND e.clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employees e
      WHERE e.id = public.employee_services.employee_id
        AND e.clinic_id = (SELECT clinic_id FROM public.user_profiles WHERE id = auth.uid() LIMIT 1)
    )
  );

-- 4) Atualizar função register_clinic para comportamento robusto
CREATE OR REPLACE FUNCTION public.register_clinic(
  clinic_name TEXT,
  clinic_slug TEXT,
  first_name TEXT,
  last_name TEXT
) RETURNS UUID AS $$
DECLARE
  new_clinic_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Criar clínica
  INSERT INTO public.clinics (name, slug)
    VALUES (clinic_name, clinic_slug)
    RETURNING id INTO new_clinic_id;

  -- Inserir/atualizar profile do usuário apontando para a nova clinic
  INSERT INTO public.user_profiles (id, clinic_id, first_name, last_name, role)
    VALUES (auth.uid(), new_clinic_id, first_name, last_name, 'admin')
    ON CONFLICT (id) DO UPDATE SET clinic_id = EXCLUDED.clinic_id, first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
    RETURNING clinic_id INTO new_clinic_id;

  RETURN new_clinic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Observação: aplique em ambiente de teste primeiro. Esta migration modifica RLS e funções.
