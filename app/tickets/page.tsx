"use client";
import { useState, useEffect } from "react";
import { fetchTickets, Ticket } from "@/app/(actions)/ticketActions"; // sesuaikan path

export default function UserTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Ticket[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getData() {
      const { data, error } = await fetchTickets();
      if (error) setError(error.message);
      else setTickets(data || []);
    }
    getData();
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

  return (
    <div>
      <h2>Daftar Tiket</h2>
      <input
        placeholder="Cari asal/tujuan..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Origin</th>
            <th>Destination</th>
            <th>Date</th>
            <th>Time</th>
            <th>Price</th>
            <th>Stock</th>
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
            </tr>
          ))}
        </tbody>
      </table>
      {filtered.length === 0 && <div>Tidak ada tiket.</div>}
    </div>
  );
}
