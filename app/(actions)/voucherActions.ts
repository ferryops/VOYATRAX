"use client";
import { createClient } from "@/utils/supabase/client";

export type Voucher = {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  quota: number;
  valid_from: string;
  valid_until: string;
};

export async function fetchVouchers() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("vouchers")
    .select("*")
    .order("id", { ascending: false });
  return { data, error };
}

export async function createVoucher(voucher: Partial<Voucher>) {
  const supabase = createClient();
  const { error } = await supabase.from("vouchers").insert([voucher]);
  return { error };
}

export async function updateVoucher(id: number, voucher: Partial<Voucher>) {
  const supabase = createClient();
  const { error } = await supabase
    .from("vouchers")
    .update(voucher)
    .eq("id", id);
  return { error };
}

export async function deleteVoucher(id: number) {
  const supabase = createClient();
  const { error } = await supabase.from("vouchers").delete().eq("id", id);
  return { error };
}
