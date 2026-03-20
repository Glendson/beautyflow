-- Clinics Table
CREATE TABLE IF NOT EXISTS public.clinics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS setup for Clinics
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clinic"
    ON public.clinics
    FOR SELECT
    USING (id = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'clinic_id')::uuid);

CREATE POLICY "Users can update their own clinic"
    ON public.clinics
    FOR UPDATE
    USING (id = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'clinic_id')::uuid);

CREATE POLICY "Users can insert clinics"
    ON public.clinics
    FOR INSERT
    WITH CHECK (true); -- Typically handled by server-side code without RLS or an edge function

-- User Profiles (links Auth users to Clinics)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view profiles in their clinic"
    ON public.user_profiles
    FOR SELECT
    USING (clinic_id = (current_setting('request.jwt.claims', true)::jsonb -> 'app_metadata' ->> 'clinic_id')::uuid);

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (id = auth.uid());
