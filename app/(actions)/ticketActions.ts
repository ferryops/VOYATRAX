"use client";
import { createClient } from "@/utils/supabase/client";

export type Ticket = {
  id: number;
  origin: string;
  destination: string;
  date: string;
  departure_time: string;
  price: number;
  stock: number;
};

// Ambil semua tiket
export async function fetchTickets() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("id", { ascending: false });
  return { data, error };
}

// Tambah tiket baru
export async function createTicket(ticket: Partial<Ticket>) {
  const supabase = createClient();
  const { error } = await supabase.from("tickets").insert([ticket]);
  return { error };
}

// Update tiket
export async function updateTicket(id: number, ticket: Partial<Ticket>) {
  const supabase = createClient();
  const { error } = await supabase.from("tickets").update(ticket).eq("id", id);
  return { error };
}

// Hapus tiket
export async function deleteTicket(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from("tickets").delete().eq("id", id);
  return { error };
}
