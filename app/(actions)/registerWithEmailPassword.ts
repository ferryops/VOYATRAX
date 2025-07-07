"use client";
import { createClient } from "@/utils/supabase/client";

export async function registerWithEmailPassword(
  name: string,
  email: string,
  password: string
) {
  const supabase = createClient();
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  });
}
