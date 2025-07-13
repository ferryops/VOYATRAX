"use client";
import { useEffect, useState } from "react";
import {
  fetchAirports,
  createAirport,
  updateAirport,
  deleteAirport,
  Airport,
} from "@/app/(actions)/airportActions";
import { useForm } from "react-hook-form";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type AirportFormInput = {
  city: string;
  name: string;
  code: string;
};

export default function AdminAirports() {
  useDocumentTitle("Manajemen Bandara (Admin)");

  const [airports, setAirports] = useState<Airport[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<AirportFormInput>({
    defaultValues: {
      city: "",
      name: "",
      code: "",
    },
  });

  useEffect(() => {
    refreshAirports();
  }, []);

  const refreshAirports = async () => {
    const { data, error } = await fetchAirports();
    if (error) setError(error.message);
    else setAirports(data || []);
  };

  const onSubmit = async (formData: AirportFormInput) => {
    setError("");
    if (editingId) {
      const { error } = await updateAirport(editingId, formData);
      if (error) setError(error.message);
    } else {
      const { error } = await createAirport(formData);
      if (error) setError(error.message);
    }
    reset();
    setEditingId(null);
    refreshAirports();
  };

  const handleEdit = (airport: Airport) => {
    setValue("city", airport.city);
    setValue("name", airport.name);
    setValue("code", airport.code);
    setEditingId(airport.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus bandara ini?")) return;
    const { error } = await deleteAirport(id);
    if (error) setError(error.message);
    refreshAirports();
  };

  const handleReset = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">🛬</span>
          Kelola Bandara (Admin)
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 px-6 py-7 mb-8 flex flex-col gap-4"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <input
                placeholder="Kota"
                {...register("city", { required: "Kota wajib diisi" })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.city && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.city.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Nama Bandara"
                {...register("name", { required: "Nama bandara wajib diisi" })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.name && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.name.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Kode IATA (3 huruf)"
                {...register("code", {
                  required: "Kode wajib diisi",
                  minLength: { value: 3, message: "Kode harus 3 huruf" },
                  maxLength: { value: 3, message: "Kode harus 3 huruf" },
                  pattern: {
                    value: /^[A-Za-z]+$/,
                    message: "Kode hanya huruf",
                  },
                })}
                className="w-full px-4 py-3 uppercase rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.code && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.code.message}
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
              {editingId ? "Update" : "Tambah"} Bandara
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
          {airports.length === 0 && (
            <div className="text-gray-400 text-center py-12">
              Tidak ada bandara.
            </div>
          )}
          {airports.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4"
            >
              <div className="flex-1 flex flex-col md:flex-row gap-4 items-center md:items-center">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-base text-gray-500 font-medium">
                    Kota
                  </span>
                  <span className="text-lg font-semibold text-blue-700">
                    {a.city}
                  </span>
                </div>
                <span className="mx-4 hidden md:inline text-gray-400 text-2xl">
                  –
                </span>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-base text-gray-500 font-medium">
                    Nama Bandara
                  </span>
                  <span className="text-lg font-semibold text-blue-700">
                    {a.name}
                  </span>
                </div>
                <span className="mx-4 hidden md:inline text-gray-400 text-2xl">
                  /
                </span>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-base text-gray-500 font-medium">
                    Kode
                  </span>
                  <span className="text-lg font-semibold text-blue-700 uppercase">
                    {a.code}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[120px] items-end">
                <button
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow transition"
                  onClick={() => handleEdit(a)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow transition"
                  onClick={() => handleDelete(a.id)}
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
