import { useEffect, useRef, useState } from "react";
import { fetchAirports, Airport } from "@/app/(actions)/airportActions";

type AutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export default function AutocompleteInput({
  value,
  onChange,
  placeholder,
  className = "",
}: AutocompleteInputProps) {
  const [suggestions, setSuggestions] = useState<Airport[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!value) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    fetchAirports(value).then(({ data }) => {
      setSuggestions(data || []);
      setLoading(false);
    });
  }, [value]);

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        className={`w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-cyan-400 ${className}`}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-y-auto">
          {suggestions.map((airport) => (
            <li
              key={airport.id}
              className="px-4 py-2 cursor-pointer hover:bg-cyan-100"
              onMouseDown={() => {
                onChange(`${airport.city}`);
                setShowSuggestions(false);
              }}
            >
              <div className="font-semibold">
                {airport.city} <span className="text-xs">({airport.code})</span>
              </div>
              <div className="text-sm text-gray-500">{airport.name}</div>
            </li>
          ))}
        </ul>
      )}
      {loading && (
        <div className="absolute top-full left-0 px-4 py-1 text-xs bg-white text-gray-500">
          Loading...
        </div>
      )}
    </div>
  );
}
