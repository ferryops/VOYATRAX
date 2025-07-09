"use client";
import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "@/app/(actions)/orderActions";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AdminOrders() {
  useDocumentTitle("Manajemen Order Tiket (Admin)");
  const [orders, setOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [statusUpdate, setStatusUpdate] = useState<{ [id: number]: string }>(
    {}
  );
  const statuses = ["pending", "paid", "issued", "canceled"];

  const refresh = async () => {
    const { data, error } = await fetchAllOrders();
    if (error) setError(error.message);
    else setOrders(data || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleChangeStatus = (orderId: number, newStatus: string) => {
    setStatusUpdate((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  const handleUpdateStatus = async (orderId: number) => {
    const status = statusUpdate[orderId];
    if (!status) return;
    const { error } = await updateOrderStatus(orderId, status);
    if (error) setError(error.message);
    else refresh();
  };

  function statusBadge(status: string) {
    const map: Record<string, string> = {
      paid: "bg-green-100 text-green-700",
      issued: "bg-blue-100 text-blue-700",
      pending: "bg-yellow-100 text-yellow-700",
      canceled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={
          "px-3 py-1 rounded-xl text-xs font-bold uppercase " +
          (map[status] || "bg-gray-100 text-gray-500")
        }
      >
        {status}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">📝</span>
          Manajemen Order Tiket (Admin)
        </h2>
        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}
        <div className="grid gap-6">
          {orders.length === 0 && (
            <div className="text-gray-400 text-center py-16 text-lg">
              Tidak ada order.
            </div>
          )}
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-md border border-blue-100 p-6 flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex flex-col md:flex-row gap-2 items-center">
                  <span className="text-gray-500 font-medium">Order ID:</span>
                  <span className="font-bold text-blue-700">{order.id}</span>
                  <span className="hidden md:inline text-gray-400 mx-2">•</span>
                  <span className="text-gray-500 font-medium">User:</span>
                  <span className="font-semibold">
                    {order.users?.name || order.user_id}
                  </span>
                  <span className="hidden md:inline text-gray-400 mx-2">•</span>
                  <span className="text-gray-500 font-medium">Tanggal:</span>
                  <span className="font-semibold">
                    {order.order_date?.slice(0, 10)}
                  </span>
                </div>
                <div>{statusBadge(order.status)}</div>
              </div>
              <div className="border-t border-blue-50 mb-2"></div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-gray-500 text-sm font-medium mb-1">
                    Detail Tiket
                  </div>
                  <div className="text-sm">
                    {order.order_items.map((item: any) => (
                      <div key={item.id} className="mb-2">
                        <span className="font-semibold text-blue-600">
                          {item.ticket.origin} &rarr; {item.ticket.destination}
                        </span>
                        <div>
                          {item.ticket.date} {item.ticket.departure_time}
                        </div>
                        <div>
                          Jumlah: {item.quantity} @
                          <span className="font-semibold">
                            Rp{item.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-500 font-medium">Voucher:</span>
                    {order.vouchers ? (
                      <span className="bg-blue-50 px-2 rounded text-blue-600 font-bold ml-1">
                        {order.vouchers.code} ({order.vouchers.discount_type}{" "}
                        {order.vouchers.discount_value})
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-gray-500 font-medium">
                      Total Bayar:
                    </span>
                    <span className="text-lg font-bold text-blue-700 ml-1">
                      Rp {order.total_price.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="mt-2 flex gap-2 items-center">
                    <select
                      value={statusUpdate[order.id] ?? order.status}
                      onChange={(e) =>
                        handleChangeStatus(order.id, e.target.value)
                      }
                      className="px-4 py-2 rounded-xl border border-blue-300 focus:ring-2 focus:ring-blue-400 shadow-sm text-sm transition"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleUpdateStatus(order.id)}
                      className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow-md transition disabled:opacity-70"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
