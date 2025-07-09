"use client";
import { createClient } from "@/utils/supabase/client";

export async function loginWithRole(email: string, password: string) {
  const supabase = createClient();

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error, role: null };
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (userError || !userData) {
    return { error: userError, role: null };
  }

  return { error: null, role: userData.role };
}
