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

type TicketFormInput = {
  origin: string;
  destination: string;
  date: string;
  departure_time: string;
  price: number;
  stock: number;
};

export default function AdminTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<TicketFormInput>({
    defaultValues: {
      origin: "",
      destination: "",
      date: "",
      departure_time: "",
      price: 0,
      stock: 0,
    },
  });

  // Fetch tickets ketika komponen load
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
    <div className="p-8">
      <h1 className="font-bold text-2xl mb-4">CRUD Tiket (Admin Only)</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 grid grid-cols-6 gap-2"
      >
        <input
          placeholder="Origin"
          {...register("origin", { required: "Origin is required" })}
          className="input input-bordered"
        />
        <input
          placeholder="Destination"
          {...register("destination", { required: "Destination is required" })}
          className="input input-bordered"
        />
        <input
          placeholder="Date"
          type="date"
          {...register("date", { required: "Date is required" })}
          className="input input-bordered"
        />
        <input
          placeholder="Departure Time"
          type="time"
          {...register("departure_time", {
            required: "Departure time is required",
          })}
          className="input input-bordered"
        />
        <input
          placeholder="Price"
          type="number"
          {...register("price", { valueAsNumber: true, min: 0 })}
          className="input input-bordered"
        />
        <input
          placeholder="Stock"
          type="number"
          {...register("stock", { valueAsNumber: true, min: 0 })}
          className="input input-bordered"
        />
        <button
          type="submit"
          className="btn btn-primary col-span-2"
          disabled={isSubmitting}
        >
          {editingId ? "Update" : "Add"} Ticket
        </button>
        <button type="button" className="btn col-span-2" onClick={handleReset}>
          Reset
        </button>
      </form>
      {Object.values(errors).map((err, i) => (
        <div key={i} className="text-red-500 text-sm">
          {(err as any).message}
        </div>
      ))}
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
