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
  class: "economy" | "business" | "first";
  airlines: string;
};

export async function fetchTickets() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("tickets")
    .select("*")
    .order("id", { ascending: false });
  return { data, error };
}

export async function createTicket(ticket: Partial<Ticket>) {
  const supabase = createClient();
  const { error } = await supabase.from("tickets").insert([ticket]);
  return { error };
}

export async function updateTicket(id: number, ticket: Partial<Ticket>) {
  const supabase = createClient();
  const { error } = await supabase.from("tickets").update(ticket).eq("id", id);
  return { error };
}

export async function deleteTicket(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from("tickets").delete().eq("id", id);
  return { error };
}
