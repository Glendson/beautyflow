import { createClient } from "@/infrastructure/supabase/server";

export async function getClinicId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  console.log("🔑 [getClinicId] user:", user?.id, "userError:", userError?.message);
  
  if (userError || !user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("clinic_id")
    .eq("id", user.id)
    .limit(1)
    .maybeSingle();

  console.log("🔑 [getClinicId] data:", JSON.stringify(data), "error:", error?.message, "code:", error?.code);

  if (error || !data?.clinic_id) return null;

  return String(data.clinic_id);
}