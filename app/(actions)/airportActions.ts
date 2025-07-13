"use client";
import { createClient } from "@/utils/supabase/client";

export type Airport = {
  id: number;
  city: string;
  name: string;
  code: string;
};

export async function fetchAirports(keyword?: string) {
  const supabase = createClient();
  let query = supabase
    .from("airports")
    .select("*")
    .order("city", { ascending: true })
    .limit(50);
  if (keyword) {
    query = query.or(
      `city.ilike.%${keyword}%,name.ilike.%${keyword}%,code.ilike.%${keyword}%`
    );
  }
  const { data, error } = await query;
  return { data, error };
}

export async function createAirport(airport: Partial<Airport>) {
  const supabase = createClient();
  const { error } = await supabase.from("airports").insert([airport]);
  return { error };
}

export async function updateAirport(id: number, airport: Partial<Airport>) {
  const supabase = createClient();
  const { error } = await supabase
    .from("airports")
    .update(airport)
    .eq("id", id);
  return { error };
}

export async function deleteAirport(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from("airports").delete().eq("id", id);
  return { error };
}
