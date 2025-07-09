"use client";
import { createClient } from "@/utils/supabase/client";

export async function fetchOrderStats() {
  const supabase = createClient();
  const { data } = await supabase.rpc("order_stats_by_date");
  if (data) return { data, error: null };

  const { data: manual, error: err } = await supabase
    .from("orders")
    .select("order_date, total_price")
    .order("order_date", { ascending: true });

  const result: { [date: string]: number } = {};
  (manual || []).forEach((o: any) => {
    const date = o.order_date?.slice(0, 10);
    if (!date) return;
    if (!result[date]) result[date] = 0;
    result[date] += Number(o.total_price);
  });
  const chartData = Object.entries(result).map(([date, total]) => ({
    date,
    total,
  }));

  return { data: chartData, error: err };
}

export async function fetchOrderSummary() {
  const supabase = createClient();

  const { data } = await supabase.rpc("order_summary");
  if (data) return { data, error: null };

  const { count: totalOrders, error: err1 } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  const { data: sumRevenue, error: err2 } = await supabase
    .from("orders")
    .select("total_price");

  const totalRevenue = (sumRevenue || []).reduce(
    (sum: number, o: any) => sum + Number(o.total_price),
    0
  );

  const { data: orderItems, error: err3 } = await supabase
    .from("order_items")
    .select("quantity");

  const totalTickets = (orderItems || []).reduce(
    (sum: number, oi: any) => sum + Number(oi.quantity),
    0
  );

  return {
    data: {
      totalOrders: totalOrders ?? 0,
      totalRevenue,
      totalTickets,
    },
    error: err1 || err2 || err3,
  };
}

export async function fetchOrderStatusSummary() {
  const supabase = createClient();

  const { data } = await supabase.rpc("order_status_summary");
  if (data) return { data, error: null };

  const { data: orders, error: err } = await supabase
    .from("orders")
    .select("status");

  const result: { [status: string]: number } = {};
  (orders || []).forEach((o: any) => {
    const s = o.status || "unknown";
    if (!result[s]) result[s] = 0;
    result[s]++;
  });

  const statusArr = Object.entries(result).map(([status, count]) => ({
    status,
    count,
  }));

  return { data: statusArr, error: err };
}

export async function fetchPopularRoutes() {
  const supabase = createClient();
  const { data } = await supabase.rpc("popular_routes");
  if (data) return { data, error: null };

  const { data: items, error: err } = await supabase
    .from("order_items")
    .select("quantity, ticket_id, tickets(origin, destination)")
    .order("quantity", { ascending: false });

  const routeMap: { [route: string]: number } = {};
  (items || []).forEach((oi: any) => {
    const origin = oi.tickets?.origin;
    const dest = oi.tickets?.destination;
    if (!origin || !dest) return;
    const key = `${origin} → ${dest}`;
    if (!routeMap[key]) routeMap[key] = 0;
    routeMap[key] += Number(oi.quantity);
  });

  const popularRoutes = Object.entries(routeMap)
    .map(([route, total]) => ({ route, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return { data: popularRoutes, error: err };
}
