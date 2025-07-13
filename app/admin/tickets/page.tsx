"use client";
import { useState, useEffect } from "react";
import {
  fetchTickets,
  createTicket,
  updateTicket,
  deleteTicket,
  Ticket,
} from "@/app/(actions)/ticketActions";
import { useForm } from "react-hook-form";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import AutocompleteInput from "@/components/AutocompleteInput";
import AutocompleteAirlineInput from "@/components/AutocompleteInputAirline";

type TicketFormInput = {
  origin: string;
  destination: string;
  date: string;
  departure_time: string;
  price: number;
  stock: number;
  class: "economy" | "business" | "first";
  airlines: string;
};

export default function AdminTickets() {
  useDocumentTitle("Manajemen Tiket (Admin)");

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<TicketFormInput>({
    defaultValues: {
      origin: "",
      destination: "",
      date: "",
      departure_time: "",
      price: 0,
      stock: 0,
      class: "economy",
    },
  });

  useEffect(() => {
    refreshTickets();
  }, []);

  const refreshTickets = async () => {
    const { data, error } = await fetchTickets();
    if (error) setError(error.message);
    else setTickets(data || []);
  };

  const onSubmit = async (formData: TicketFormInput) => {
    setError("");
    if (editingId) {
      const { error } = await updateTicket(editingId, formData);
      if (error) setError(error.message);
    } else {
      const { error } = await createTicket(formData);
      if (error) setError(error.message);
    }
    reset();
    setEditingId(null);
    refreshTickets();
  };

  const handleEdit = (ticket: Ticket) => {
    setValue("origin", ticket.origin);
    setValue("destination", ticket.destination);
    setValue("date", ticket.date);
    setValue("departure_time", ticket.departure_time);
    setValue("price", Number(ticket.price));
    setValue("stock", Number(ticket.stock));
    setValue("class", ticket.class);
    setValue("airlines", ticket.airlines);
    setEditingId(ticket.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this ticket?")) return;
    const { error } = await deleteTicket(id);
    if (error) setError(error.message);
    refreshTickets();
  };

  const handleReset = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">🛠️</span>
          Kelola Tiket (Admin)
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 px-6 py-7 mb-8 flex flex-col gap-4"
        >
          <div className="grid md:grid-cols-6 gap-4">
            <div>
              <AutocompleteInput
                value={watch("origin")}
                onChange={(val) =>
                  setValue("origin", val, { shouldValidate: true })
                }
                placeholder="Kota/Bandara Asal"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.origin && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.origin.message}
                </div>
              )}
            </div>
            <div>
              <AutocompleteInput
                value={watch("destination")}
                onChange={(val) =>
                  setValue("destination", val, { shouldValidate: true })
                }
                placeholder="Kota/Bandara Tujuan"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.destination && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.destination.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Date"
                type="date"
                {...register("date", { required: "Date is required" })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.date && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.date.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Departure Time"
                type="time"
                {...register("departure_time", {
                  required: "Departure time is required",
                })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.departure_time && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.departure_time.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Price"
                type="number"
                {...register("price", { valueAsNumber: true, min: 0 })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.price && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Stock"
                type="number"
                {...register("stock", { valueAsNumber: true, min: 0 })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.stock && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.stock.message}
                </div>
              )}
            </div>
            <div>
              <select
                {...register("class", { required: "Class is required" })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition"
              >
                <option value="economy">Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
              {errors.class && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.class.message}
                </div>
              )}
            </div>
            <div>
              <AutocompleteAirlineInput
                value={watch("airlines")}
                onChange={(val) =>
                  setValue("airlines", val, { shouldValidate: true })
                }
                placeholder="Maskapai"
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.airlines && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.airlines.message}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition min-w-[120px] disabled:opacity-70"
              disabled={isSubmitting}
            >
              {editingId ? "Update" : "Add"} Ticket
            </button>
            <button
              type="button"
              className="px-6 py-3 rounded-xl border border-blue-400 text-blue-600 hover:bg-blue-100 font-semibold shadow-md transition min-w-[120px]"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-3 rounded-xl mb-4 text-center font-medium">
            {error}
          </div>
        )}

        <div className="grid gap-6">
          {tickets.length === 0 && (
            <div className="text-gray-400 text-center py-12">
              Tidak ada tiket.
            </div>
          )}
          {tickets.map((t) => (
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
                  <span className="text-gray-500">Jam</span>
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
                <div>
                  <span className="text-gray-500">Class</span>
                  <div className="font-semibold">{t.class}</div>
                </div>
                <div>
                  <span className="text-gray-500">Maskapai</span>
                  <div className="font-semibold">{t.airlines}</div>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[120px] items-end">
                <button
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow transition"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow transition"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
