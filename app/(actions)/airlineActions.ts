"use client";
import { createClient } from "@/utils/supabase/client";

export type Airline = {
  id: number;
  name: string;
  code: string;
  country?: string;
};

export async function fetchAirlines(keyword?: string) {
  const supabase = createClient();
  let query = supabase
    .from("airlines")
    .select("*")
    .order("name", { ascending: true })
    .limit(50);
  if (keyword) {
    query = query.or(
      `name.ilike.%${keyword}%,code.ilike.%${keyword}%,country.ilike.%${keyword}%`
    );
  }
  const { data, error } = await query;
  return { data, error };
}

export async function createAirline(airline: Partial<Airline>) {
  const supabase = createClient();
  const { error } = await supabase.from("airlines").insert([airline]);
  return { error };
}

export async function updateAirline(id: number, airline: Partial<Airline>) {
  const supabase = createClient();
  const { error } = await supabase
    .from("airlines")
    .update(airline)
    .eq("id", id);
  return { error };
}

export async function deleteAirline(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from("airlines").delete().eq("id", id);
  return { error };
}
