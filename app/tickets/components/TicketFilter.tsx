import { useState } from "react";

type TicketFilterProps = {
  onFilter: (filter: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate: string;
  }) => void;
};

export default function TicketFilter({ onFilter }: TicketFilterProps) {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [enableReturn, setEnableReturn] = useState(false);
  const [returnDate, setReturnDate] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onFilter({
      origin,
      destination,
      departureDate,
      returnDate: enableReturn ? returnDate : "",
    });
  };

  return (
    <form
      className="flex flex-wrap gap-3 bg-white/80 rounded-2xl p-4 shadow mb-8 items-center justify-center"
      onSubmit={handleSubmit}
    >
      {/* Origin */}
      <div className="flex items-center gap-2 flex-1 min-w-[180px]">
        <span className="text-2xl">🛫</span>
        <input
          type="text"
          placeholder="Kota/Bandara Asal"
          className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
        />
      </div>

      {/* Swap Icon */}
      <button
        type="button"
        className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 transition"
        onClick={() => {
          setOrigin(destination);
          setDestination(origin);
        }}
        title="Tukar asal & tujuan"
      >
        <span className="text-xl">🔄</span>
      </button>

      {/* Destination */}
      <div className="flex items-center gap-2 flex-1 min-w-[180px]">
        <span className="text-2xl">🛬</span>
        <input
          type="text"
          placeholder="Kota/Bandara Tujuan"
          className="w-full px-4 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>

      {/* Departure Date */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <span className="text-xl">📅</span>
        <input
          type="date"
          className="px-3 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400"
          value={departureDate}
          onChange={(e) => setDepartureDate(e.target.value)}
        />
      </div>

      {/* Return Date Checkbox */}
      <div className="flex items-center gap-2 min-w-[140px]">
        <input
          id="enableReturn"
          type="checkbox"
          checked={enableReturn}
          onChange={(e) => setEnableReturn(e.target.checked)}
        />
        <label htmlFor="enableReturn" className="select-none font-medium">
          Return Date
        </label>
      </div>

      {/* Return Date Input */}
      <div className="flex items-center gap-2 min-w-[180px]">
        <span className="text-xl">📅</span>
        <input
          type="date"
          className="px-3 py-2 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          disabled={!enableReturn}
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
