"use client";
import { createClient } from "@/utils/supabase/client";

export async function loginWithEmailPassword(email: string, password: string) {
  const supabase = createClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}
