"use client";
import { useEffect, useState } from "react";
import {
  fetchAirlines,
  createAirline,
  updateAirline,
  deleteAirline,
  Airline,
} from "@/app/(actions)/airlineActions";
import { useForm } from "react-hook-form";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type AirlineFormInput = {
  name: string;
  code: string;
  country?: string;
};

export default function AdminAirlines() {
  useDocumentTitle("Manajemen Maskapai (Admin)");

  const [airlines, setAirlines] = useState<Airline[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<AirlineFormInput>({
    defaultValues: {
      name: "",
      code: "",
      country: "",
    },
  });

  useEffect(() => {
    refreshAirlines();
  }, []);

  const refreshAirlines = async () => {
    const { data, error } = await fetchAirlines();
    if (error) setError(error.message);
    else setAirlines(data || []);
  };

  const onSubmit = async (formData: AirlineFormInput) => {
    setError("");
    if (editingId) {
      const { error } = await updateAirline(editingId, formData);
      if (error) setError(error.message);
    } else {
      const { error } = await createAirline(formData);
      if (error) setError(error.message);
    }
    reset();
    setEditingId(null);
    refreshAirlines();
  };

  const handleEdit = (airline: Airline) => {
    setValue("name", airline.name);
    setValue("code", airline.code);
    setValue("country", airline.country ?? "");
    setEditingId(airline.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus maskapai ini?")) return;
    const { error } = await deleteAirline(id);
    if (error) setError(error.message);
    refreshAirlines();
  };

  const handleReset = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">🛩️</span>
          Kelola Maskapai (Admin)
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 px-6 py-7 mb-8 flex flex-col gap-4"
        >
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <input
                placeholder="Nama Maskapai"
                {...register("name", { required: "Nama wajib diisi" })}
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
                placeholder="Kode Maskapai (ex: GA)"
                {...register("code", {
                  required: "Kode wajib diisi",
                })}
                className="w-full px-4 py-3 uppercase rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.code && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.code.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Negara (opsional)"
                {...register("country")}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
            </div>
          </div>
          <div className="flex gap-4 justify-end mt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-md transition min-w-[120px] disabled:opacity-70"
              disabled={isSubmitting}
            >
              {editingId ? "Update" : "Tambah"} Maskapai
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
          {airlines.length === 0 && (
            <div className="text-gray-400 text-center py-12">
              Tidak ada maskapai.
            </div>
          )}
          {airlines.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4"
            >
              <div className="flex-1 flex flex-col md:flex-row gap-4 items-center md:items-center">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-base text-gray-500 font-medium">
                    Nama
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
                {a.country && (
                  <>
                    <span className="mx-4 hidden md:inline text-gray-400 text-2xl">
                      🌍
                    </span>
                    <div className="flex flex-col items-center md:items-start">
                      <span className="text-base text-gray-500 font-medium">
                        Negara
                      </span>
                      <span className="text-lg font-semibold text-blue-700">
                        {a.country}
                      </span>
                    </div>
                  </>
                )}
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
