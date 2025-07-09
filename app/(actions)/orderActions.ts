"use client";
import { createClient } from "@/utils/supabase/client";

export type OrderInput = {
  ticket_id: number;
  quantity: number;
  voucher_code?: string;
};

export async function createOrder(
  user_id: string,
  items: OrderInput[],
  voucher_code?: string
) {
  const supabase = createClient();

  let voucher = null;
  if (voucher_code) {
    const { data, error } = await supabase
      .from("vouchers")
      .select("*")
      .eq("code", voucher_code)
      .single();
    if (error || !data)
      return { error: { message: "Voucher tidak ditemukan!" } };
    voucher = data;

    const now = new Date();
    if (
      new Date(voucher.valid_from) > now ||
      new Date(voucher.valid_until) < now
    ) {
      return { error: { message: "Voucher tidak berlaku!" } };
    }
    if (voucher.quota <= 0) {
      return { error: { message: "Voucher sudah habis kuota!" } };
    }
  }

  let total_price = 0;
  for (const item of items) {
    const { data: t } = await supabase
      .from("tickets")
      .select("price,stock")
      .eq("id", item.ticket_id)
      .single();
    if (!t) return { error: { message: "Tiket tidak ditemukan!" } };
    if (t.stock < item.quantity)
      return { error: { message: "Stok tidak cukup!" } };
    total_price += Number(t.price) * item.quantity;
  }

  let discount = 0;
  let voucher_id = null;
  if (voucher) {
    voucher_id = voucher.id;
    if (voucher.discount_type === "percent") {
      discount = (total_price * Number(voucher.discount_value)) / 100;
    } else {
      discount = Number(voucher.discount_value);
    }
    if (discount > total_price) discount = total_price;
  }

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert([
      {
        user_id,
        total_price: total_price - discount,
        status: "pending",
        voucher_id: voucher_id,
      },
    ])
    .select("id")
    .single();
  if (orderError) return { error: orderError };

  for (const item of items) {
    await supabase.from("order_items").insert([
      {
        order_id: order.id,
        ticket_id: item.ticket_id,
        quantity: item.quantity,
        price: total_price,
      },
    ]);

    const { data: ticketData, error: ticketError } = await supabase
      .from("tickets")
      .select("stock")
      .eq("id", item.ticket_id)
      .single();
    if (ticketError || !ticketData) {
      return { error: { message: "Gagal memperbarui stok tiket!" } };
    }
    const newStock = ticketData.stock - item.quantity;
    await supabase
      .from("tickets")
      .update({ stock: newStock })
      .eq("id", item.ticket_id);
  }

  if (voucher) {
    await supabase
      .from("vouchers")
      .update({ quota: voucher.quota - 1 })
      .eq("id", voucher.id);
    await supabase
      .from("vouchers_used")
      .insert([{ user_id, voucher_id: voucher.id }]);
  }

  return { error: null, order_id: order.id };
}

export async function fetchOrderHistory(user_id: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id, order_date, total_price, status,
        voucher_id,
        order_items (
          id, quantity, price,
          ticket:ticket_id (origin, destination, date, departure_time)
        ),
        vouchers (code, discount_type, discount_value)
      `
    )
    .eq("user_id", user_id)
    .order("order_date", { ascending: false });
  return { data, error };
}

export async function fetchAllOrders() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
        id, order_date, total_price, status,
        user_id,
        users(name),
        order_items (
          id, quantity, price,
          ticket:ticket_id (origin, destination, date, departure_time)
        ),
        vouchers (code, discount_type, discount_value)
      `
    )
    .order("order_date", { ascending: false });
  return { data, error };
}

export async function updateOrderStatus(orderId: number, status: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);
  return { error };
}
