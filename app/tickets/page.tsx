"use client";
import { useState, useEffect } from "react";
import { fetchTickets, Ticket } from "@/app/(actions)/ticketActions";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { createOrder } from "../(actions)/orderActions";

type OrderFormInputs = {
  items: Record<string, number>;
  voucher: string;
};

export default function UserTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Ticket[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userId, setUserId] = useState<string>("");

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitting },
  } = useForm<OrderFormInputs>({
    defaultValues: { items: {}, voucher: "" },
  });

  useEffect(() => {
    async function getData() {
      const { data, error } = await fetchTickets();
      if (error) setError(error.message);
      else setTickets(data || []);
    }
    getData();

    // Ambil user id (dari session Supabase)
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (data.user) setUserId(data.user.id);
      });
  }, []);

  useEffect(() => {
    if (!query) setFiltered(tickets);
    else {
      setFiltered(
        tickets.filter(
          (t) =>
            t.origin.toLowerCase().includes(query.toLowerCase()) ||
            t.destination.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, tickets]);

  const onSubmit = async (formData: OrderFormInputs) => {
    setError("");
    setSuccess("");
    const items = Object.entries(formData.items || {})
      .filter(([_, qty]) => qty && Number(qty) > 0)
      .map(([ticket_id, qty]) => ({
        ticket_id: Number(ticket_id),
        quantity: Number(qty),
      }));

    if (!userId) return setError("User tidak ditemukan.");
    if (!items.length) return setError("Pilih tiket minimal 1.");

    const { error, order_id } = await createOrder(
      userId,
      items,
      formData.voucher
    );
    if (error) setError(error.message);
    else {
      setSuccess(`Order berhasil! ID: ${order_id}`);
      reset();
    }
  };

  return (
    <div>
      <h2>Daftar Tiket</h2>
      <input
        placeholder="Cari asal/tujuan..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <table>
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Date</th>
              <th>Time</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id}>
                <td>{t.origin}</td>
                <td>{t.destination}</td>
                <td>{t.date}</td>
                <td>{t.departure_time}</td>
                <td>{t.price}</td>
                <td>{t.stock}</td>
                <td>
                  <input
                    type="number"
                    min={0}
                    max={t.stock}
                    {...register(`items.${t.id}`, {
                      valueAsNumber: true,
                      min: 0,
                      max: t.stock,
                    })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <label>Voucher (opsional): </label>
          <input {...register("voucher")} />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Memproses..." : "Order"}
        </button>
      </form>
      {success && <div style={{ color: "green" }}>{success}</div>}
      {filtered.length === 0 && <div>Tidak ada tiket.</div>}
    </div>
  );
}
