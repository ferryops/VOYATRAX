"use client";
import { createClient } from "@/utils/supabase/client";

// Get Total Order Stats by Date
export async function fetchOrderStats() {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("order_stats_by_date"); // pakai function SQL, atau
  if (data) return { data, error: null };

  // fallback manual if RPC function not available
  const { data: manual, error: err } = await supabase
    .from("orders")
    .select("order_date, total_price")
    .order("order_date", { ascending: true });

  // agregate total price by date
  const result: { [date: string]: number } = {};
  (manual || []).forEach((o: any) => {
    const date = o.order_date?.slice(0, 10);
    if (!date) return;
    if (!result[date]) result[date] = 0;
    result[date] += Number(o.total_price);
  });
  // convert to chart data format
  const chartData = Object.entries(result).map(([date, total]) => ({
    date,
    total,
  }));

  return { data: chartData, error: err };
}
