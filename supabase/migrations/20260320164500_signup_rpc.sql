CREATE OR REPLACE FUNCTION public.register_clinic(clinic_name TEXT, clinic_slug TEXT, first_name TEXT, last_name TEXT)
RETURNS UUID AS $$
DECLARE
  new_clinic_id UUID;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  INSERT INTO public.clinics (name, slug)
  VALUES (clinic_name, clinic_slug)
  RETURNING id INTO new_clinic_id;

  INSERT INTO public.user_profiles (id, clinic_id, first_name, last_name, role)
  VALUES (auth.uid(), new_clinic_id, first_name, last_name, 'admin');

  RETURN new_clinic_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
