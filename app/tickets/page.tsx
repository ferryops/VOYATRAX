"use client";
import { useState, useEffect } from "react";
import { fetchTickets, Ticket } from "@/app/(actions)/ticketActions";
import { createClient } from "@/utils/supabase/client";
import { useForm } from "react-hook-form";
import { createOrder } from "../(actions)/orderActions";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type OrderFormInputs = {
  items: Record<string, number>;
  voucher: string;
};

export default function UserTickets() {
  useDocumentTitle("Daftar Tiket");
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
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">🎟️</span>
          Daftar Tiket
        </h2>
        <div className="flex gap-2 mb-6">
          <input
            placeholder="Cari asal/tujuan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 transition placeholder-gray-400 shadow"
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 text-green-700 px-4 py-3 rounded-xl mb-4 text-center font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-6">
            {filtered.length === 0 && (
              <div className="text-gray-400 text-center py-12">
                Tidak ada tiket.
              </div>
            )}
            {filtered.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4"
              >
                <div className="flex-1 flex flex-col md:flex-row gap-4 items-center md:items-center">
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-base text-gray-500 font-medium">
                      Dari
                    </span>
                    <span className="text-lg font-semibold text-blue-700">
                      {t.origin}
                    </span>
                  </div>
                  <span className="mx-4 hidden md:inline text-gray-400 text-2xl">
                    →
                  </span>
                  <div className="flex flex-col items-center md:items-start">
                    <span className="text-base text-gray-500 font-medium">
                      Ke
                    </span>
                    <span className="text-lg font-semibold text-blue-700">
                      {t.destination}
                    </span>
                  </div>
                </div>
                <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Tanggal</span>
                    <div className="font-semibold">{t.date}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Jam Berangkat</span>
                    <div className="font-semibold">{t.departure_time}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Harga</span>
                    <div className="font-bold text-blue-600 text-lg">
                      Rp{Number(t.price).toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Stok</span>
                    <div className="font-semibold">{t.stock}</div>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between min-w-[110px]">
                  <label className="text-gray-600 text-sm mb-2">
                    Jumlah Tiket
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={t.stock}
                    {...register(`items.${t.id}`, {
                      valueAsNumber: true,
                      min: 0,
                      max: t.stock,
                    })}
                    className="w-20 px-3 py-2 rounded-lg border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <input
                {...register("voucher")}
                placeholder="Kode Voucher (opsional)"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow placeholder-gray-400"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md transition min-w-[140px] disabled:opacity-70"
            >
              {isSubmitting ? "Memproses..." : "Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
