"use client";
import { useEffect, useState } from "react";
import { fetchOrderStats } from "@/app/(actions)/analyticsActions";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrasi komponen chart.js yang dipakai
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [dataChart, setDataChart] = useState<{ date: string; total: number }[]>(
    []
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderStats().then(({ data, error }) => {
      if (error) setError(error.message);
      else setDataChart(data || []);
    });
  }, []);

  const chartData = {
    labels: dataChart.map((d) => d.date),
    datasets: [
      {
        label: "Total Penjualan",
        data: dataChart.map((d) => d.total),
        fill: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: true, position: "top" as const },
      title: { display: true, text: "Chart Penjualan Per Hari" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div>
      <h2>Dashboard Penjualan</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {dataChart.length === 0 ? (
        <div>Belum ada data penjualan.</div>
      ) : (
        <div style={{ maxWidth: 600 }}>
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}
