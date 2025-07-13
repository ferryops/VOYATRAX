import AutocompleteInput from "@/components/AutocompleteInput";
import AutocompleteAirlineInput from "@/components/AutocompleteInputAirline";
import { classOptions } from "@/constants/classOptions";
import { useState } from "react";

type TicketFilterProps = {
  onFilter: (filter: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
    roundTrip: boolean;
    passengers: number;
    class: string;
    airline: string;
  }) => void;
};

export default function TicketFilter({ onFilter }: TicketFilterProps) {
  const [roundTrip, setRoundTrip] = useState(true);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [flightClass, setFlightClass] = useState("economy");
  const [airline, setAirline] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter({
      origin,
      destination,
      departureDate,
      returnDate: roundTrip ? returnDate : "",
      roundTrip,
      passengers,
      class: flightClass,
      airline,
    });
  };

  return (
    <form
      className="flex flex-wrap gap-3 bg-white/90 rounded-2xl p-4 shadow-lg mb-8 items-center justify-center"
      onSubmit={handleSubmit}
    >
      {/* One-way / Round-trip */}
      <div className="flex gap-2">
        <button
          type="button"
          className={`px-5 py-2 rounded-full font-semibold transition border ${
            !roundTrip
              ? "bg-cyan-700 text-white border-cyan-700"
              : "bg-white border-gray-300 text-gray-600"
          }`}
          onClick={() => setRoundTrip(false)}
        >
          One-way
        </button>
        <button
          type="button"
          className={`px-5 py-2 rounded-full font-semibold transition border ${
            roundTrip
              ? "bg-cyan-700 text-white border-cyan-700"
              : "bg-white border-gray-300 text-gray-600"
          }`}
          onClick={() => setRoundTrip(true)}
        >
          Round-trip
        </button>
      </div>

      {/* Origin */}
      <div className="flex items-center gap-2 flex-1 min-w-[180px]">
        <span className="text-xl">🛫</span>
        <AutocompleteInput
          value={origin}
          onChange={setOrigin}
          placeholder="Kota/Bandara Asal"
        />
      </div>
      {/* Destination */}
      <div className="flex items-center gap-2 flex-1 min-w-[180px]">
        <span className="text-xl">🛬</span>
        <AutocompleteInput
          value={destination}
          onChange={setDestination}
          placeholder="Kota/Bandara Tujuan"
        />
      </div>
      {/* Departure Date */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <span className="text-xl">📅</span>
        <input
          type="date"
          className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-400"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </div>
      {/* Return Date */}
      {roundTrip && (
        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-xl">📅</span>
          <input
            type="date"
            className="px-3 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-400"
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
          />
        </div>
      )}
      {/* Passenger */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <span className="text-xl">👤</span>
        <select
          className="rounded-xl px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-cyan-400"
          value={passengers}
          onChange={(e) => setPassengers(Number(e.target.value))}
        >
          {[...Array(8)].map((_, i) => (
            <option key={i + 1} value={i + 1}>{`${i + 1} Penumpang`}</option>
          ))}
        </select>
      </div>
      {/* Class */}
      <div className="flex items-center gap-2 min-w-[150px]">
        <span className="text-xl">💺</span>
        <select
          className="rounded-xl px-3 py-2 border border-gray-300 focus:ring-2 focus:ring-cyan-400"
          value={flightClass}
          onChange={(e) => setFlightClass(e.target.value)}
        >
          {classOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2 flex-1 min-w-[180px]">
        <span className="text-xl">✈️</span>
        <AutocompleteAirlineInput
          value={airline}
          onChange={setAirline}
          placeholder="Maskapai (opsional)"
        />
      </div>
      {/* Search Button */}
      <button
        type="submit"
        className="bg-cyan-700 hover:bg-cyan-900 text-white rounded-full px-5 py-3 text-lg font-bold flex items-center justify-center transition"
      >
        <span className="text-2xl mr-2">🔍</span>
      </button>
    </form>
  );
}
