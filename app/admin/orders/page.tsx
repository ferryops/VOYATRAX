"use client";
import { useEffect, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "@/app/(actions)/orderActions";

export default function AdminOrders() {
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

  return (
    <div>
      <h2>Manajemen Order Tiket (Admin)</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Tanggal</th>
            <th>Detail Tiket</th>
            <th>Voucher</th>
            <th>Total</th>
            <th>Status</th>
            <th>Ubah Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.users?.name || order.user_id}</td>
              <td>{order.order_date?.slice(0, 10)}</td>
              <td>
                {order.order_items.map((item: any) => (
                  <div key={item.id}>
                    {item.ticket.origin} - {item.ticket.destination} (
                    {item.ticket.date} {item.ticket.departure_time})<br />
                    Jumlah: {item.quantity} @Rp{item.price}
                  </div>
                ))}
              </td>
              <td>
                {order.vouchers ? (
                  <span>
                    {order.vouchers.code} ({order.vouchers.discount_type}{" "}
                    {order.vouchers.discount_value})
                  </span>
                ) : (
                  "-"
                )}
              </td>
              <td>Rp {order.total_price}</td>
              <td>{order.status}</td>
              <td>
                <select
                  value={statusUpdate[order.id] ?? order.status}
                  onChange={(e) => handleChangeStatus(order.id, e.target.value)}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button onClick={() => handleUpdateStatus(order.id)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {orders.length === 0 && <div>Tidak ada order.</div>}
    </div>
  );
}
