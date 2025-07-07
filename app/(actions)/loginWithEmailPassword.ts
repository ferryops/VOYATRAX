"use client";
import { createClient } from "@/utils/supabase/client";

// Fungsi login, lalu ambil role user dari table "users"
export async function loginWithRole(email: string, password: string) {
  const supabase = createClient();

  // 1. Login
  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error, role: null };
  }

  // 2. Query role dari table users, dengan user id yang didapat dari login
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
