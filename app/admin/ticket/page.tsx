"use client";
import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";

type Ticket = {
  id: number;
  origin: string;
  destination: string;
  date: string;
  departure_time: string;
  price: number;
  stock: number;
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [form, setForm] = useState<Partial<Ticket>>({});
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const fetchTickets = async () => {
    const { data, error } = await supabase
      .from("tickets")
      .select("*")
      .order("id", { ascending: false });
    if (error) setError(error.message);
    else setTickets(data || []);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    if (editingId) {
      // Update
      const { error } = await supabase
        .from("tickets")
        .update(form)
        .eq("id", editingId);
      if (error) setError(error.message);
    } else {
      // Create
      const { error } = await supabase.from("tickets").insert([form]);
      if (error) setError(error.message);
    }
    setForm({});
    setEditingId(null);
    fetchTickets();
  };

  const handleEdit = (ticket: Ticket) => {
    setForm(ticket);
    setEditingId(ticket.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this ticket?")) return;
    const { error } = await supabase.from("tickets").delete().eq("id", id);
    if (error) setError(error.message);
    fetchTickets();
  };

  return (
    <div className="p-8">
      <h1 className="font-bold text-2xl mb-4">CRUD Tiket (Admin Only)</h1>
      <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-6 gap-2">
        <input
          placeholder="Origin"
          value={form.origin || ""}
          onChange={(e) => setForm({ ...form, origin: e.target.value })}
          className="input input-bordered"
        />
        <input
          placeholder="Destination"
          value={form.destination || ""}
          onChange={(e) => setForm({ ...form, destination: e.target.value })}
          className="input input-bordered"
        />
        <input
          placeholder="Date"
          type="date"
          value={form.date || ""}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="input input-bordered"
        />
        <input
          placeholder="Departure Time"
          type="time"
          value={form.departure_time || ""}
          onChange={(e) => setForm({ ...form, departure_time: e.target.value })}
          className="input input-bordered"
        />
        <input
          placeholder="Price"
          type="number"
          value={form.price || ""}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="input input-bordered"
        />
        <input
          placeholder="Stock"
          type="number"
          value={form.stock || ""}
          onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
          className="input input-bordered"
        />
        <button type="submit" className="btn btn-primary col-span-2">
          {editingId ? "Update" : "Add"} Ticket
        </button>
        <button
          type="button"
          className="btn col-span-2"
          onClick={() => {
            setForm({});
            setEditingId(null);
          }}
        >
          Reset
        </button>
      </form>
      {error && <div className="text-red-500">{error}</div>}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t.id}>
              <td>{t.origin}</td>
              <td>{t.destination}</td>
              <td>{t.date}</td>
              <td>{t.departure_time}</td>
              <td>Rp {t.price}</td>
              <td>{t.stock}</td>
              <td>
                <button className="btn btn-xs" onClick={() => handleEdit(t)}>
                  Edit
                </button>
                <button
                  className="btn btn-xs btn-error ml-2"
                  onClick={() => handleDelete(t.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
