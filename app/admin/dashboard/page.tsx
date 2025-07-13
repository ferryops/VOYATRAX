"use client";
import { useEffect, useState } from "react";
import {
  fetchOrderStats,
  fetchOrderSummary,
  fetchOrderStatusSummary,
  fetchPopularRoutes,
} from "@/app/(actions)/analyticsActions";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const COLORS = ["#2563eb", "#22c55e", "#fbbf24", "#ef4444", "#7c3aed"];

export default function AdminDashboard() {
  useDocumentTitle("Dashboard Admin");
  const [orderStats, setOrderStats] = useState<
    { date: string; total: number }[]
  >([]);
  const [summary, setSummary] = useState<{
    totalOrders: number;
    totalRevenue: number;
    totalTickets: number;
  }>({ totalOrders: 0, totalRevenue: 0, totalTickets: 0 });
  const [orderStatus, setOrderStatus] = useState<
    { status: string; count: number }[]
  >([]);
  const [popularRoutes, setPopularRoutes] = useState<
    { route: string; total: number }[]
  >([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderStats().then(({ data, error }) => {
      if (error) setError(error.message);
      else setOrderStats(data || []);
    });
    fetchOrderSummary().then(({ data, error }) => {
      if (error) setError(error.message);
      else setSummary(data || {});
    });
    fetchOrderStatusSummary().then(({ data, error }) => {
      if (error) setError(error.message);
      else setOrderStatus(data || []);
    });
    fetchPopularRoutes().then(({ data, error }) => {
      if (error) setError(error.message);
      else setPopularRoutes(data || []);
    });
  }, []);

  function handleExportExcel() {
    const summarySheet = [
      {
        "Total Orders": summary.totalOrders,
        "Total Revenue": summary.totalRevenue,
        "Total Tickets": summary.totalTickets,
      },
    ];
    const orderStatsSheet = orderStats.map((row) => ({
      Date: row.date,
      Total: row.total,
    }));
    const orderStatusSheet = orderStatus.map((row) => ({
      Status: row.status,
      Count: row.count,
    }));
    const popularRoutesSheet = popularRoutes.map((row) => ({
      Route: row.route,
      Total: row.total,
    }));

    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(summarySheet),
      "Summary"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(orderStatsSheet),
      "Order Stats"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(orderStatusSheet),
      "Order Status"
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.json_to_sheet(popularRoutesSheet),
      "Popular Routes"
    );

    const wbout = XLSX.write(wb, { type: "array", bookType: "xlsx" });
    saveAs(
      new Blob([wbout], { type: "application/octet-stream" }),
      "dashboard_export.xlsx"
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-7 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">📊</span>
          Admin Dashboard
        </h2>
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <div className="flex justify-end mb-5">
          <button
            onClick={handleExportExcel}
            className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold shadow transition flex items-center gap-2"
          >
            <span className="text-xl">⬇️</span>
            Export Excel
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col justify-between">
            <h3 className="font-bold text-blue-700 mb-3 text-lg flex items-center gap-2">
              🧾 Ringkasan
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Order</span>
                <span className="font-bold text-blue-600 text-xl">
                  {summary.totalOrders?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Omzet</span>
                <span className="font-bold text-green-600 text-xl">
                  Rp{summary.totalRevenue?.toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Tiket Terjual</span>
                <span className="font-bold text-blue-700 text-xl">
                  {summary.totalTickets?.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col">
            <h3 className="font-bold text-blue-700 mb-3 text-lg flex items-center gap-2">
              📈 Penjualan per Hari
            </h3>
            {orderStats.length === 0 ? (
              <div className="text-gray-400 py-12 text-center">
                Tidak ada data penjualan.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={orderStats}>
                  <XAxis dataKey="date" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#2563eb"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col">
            <h3 className="font-bold text-blue-700 mb-3 text-lg flex items-center gap-2">
              🪄 Status Order
            </h3>
            {orderStatus.length === 0 ? (
              <div className="text-gray-400 py-12 text-center">
                Tidak ada data status order.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={orderStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label={({ name, percent }) =>
                      `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {orderStatus.map((entry, idx) => (
                      <Cell
                        key={entry.status}
                        fill={COLORS[idx % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col">
            <h3 className="font-bold text-blue-700 mb-3 text-lg flex items-center gap-2">
              🛫 Rute Terpopuler
            </h3>
            {popularRoutes.length === 0 ? (
              <div className="text-gray-400 py-12 text-center">
                Tidak ada data rute.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={popularRoutes}>
                  <XAxis dataKey="route" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
