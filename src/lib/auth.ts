import { createClient } from "@/infrastructure/supabase/server";

export async function getClinicId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const clinicId = user.app_metadata?.clinic_id;
  return clinicId ? String(clinicId) : null;
}
