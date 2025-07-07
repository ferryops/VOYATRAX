// app/api/test/route.ts
import { supabase } from "@/utils/supabaseClient";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase
    .from("tickets")
    .insert([
      {
        origin: "Jakarta",
        destination: "Bandung",
        date: "2025-07-10",
        departure_time: "09:00",
        price: 120000,
        stock: 20,
      },
    ])
    .select();

  if (error) return NextResponse.json({ error });
  return NextResponse.json({ data });
}
