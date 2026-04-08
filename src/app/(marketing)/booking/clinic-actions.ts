'use server';

import { createClient } from '@/infrastructure/supabase/server';
import { Clinic } from '@/domain/clinic/Clinic';

export async function getClinicsAction(): Promise<{
  success: boolean;
  data?: Clinic[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("is_active", true)
      .order("name");

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Clinic[] };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}
