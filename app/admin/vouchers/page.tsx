"use client";
import { useState, useEffect } from "react";
import {
  fetchVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  Voucher,
} from "@/app/(actions)/voucherActions";
import { useForm } from "react-hook-form";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

type VoucherFormInput = {
  code: string;
  discount_type: string;
  discount_value: number;
  quota: number;
  valid_from: string;
  valid_until: string;
};

export default function AdminVouchers() {
  useDocumentTitle("Manajemen Voucher (Admin)");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<VoucherFormInput>({
    defaultValues: {
      code: "",
      discount_type: "",
      discount_value: 0,
      quota: 0,
      valid_from: "",
      valid_until: "",
    },
  });

  const refresh = async () => {
    const { data, error } = await fetchVouchers();
    if (error) setError(error.message);
    else setVouchers(data || []);
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit = async (formData: VoucherFormInput) => {
    setError("");
    if (editingId) {
      const { error } = await updateVoucher(editingId, formData);
      if (error) setError(error.message);
    } else {
      const { error } = await createVoucher(formData);
      if (error) setError(error.message);
    }
    reset();
    setEditingId(null);
    refresh();
  };

  const handleEdit = (v: Voucher) => {
    setValue("code", v.code || "");
    setValue("discount_type", v.discount_type || "");
    setValue("discount_value", Number(v.discount_value));
    setValue("quota", Number(v.quota));
    setValue("valid_from", v.valid_from?.slice(0, 10) || "");
    setValue("valid_until", v.valid_until?.slice(0, 10) || "");
    setEditingId(v.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete voucher?")) return;
    const { error } = await deleteVoucher(id);
    if (error) setError(error.message);
    refresh();
  };

  const handleReset = () => {
    reset();
    setEditingId(null);
  };

  function badgeType(type: string) {
    return (
      <span
        className={
          "px-2 py-1 rounded-full text-xs font-bold " +
          (type === "percent"
            ? "bg-blue-50 text-blue-700"
            : "bg-green-50 text-green-700")
        }
      >
        {type === "percent" ? "Persen (%)" : "Nominal (Rp)"}
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-2">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center flex items-center gap-2 justify-center">
          <span className="bg-blue-100 rounded-full p-2 text-2xl">🏷️</span>
          CRUD Voucher
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-lg border border-blue-100 px-6 py-7 mb-8 flex flex-col gap-4"
        >
          <div className="grid md:grid-cols-6 gap-4">
            <div>
              <input
                placeholder="Kode"
                {...register("code", { required: "Kode voucher wajib diisi" })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.code && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.code.message}
                </div>
              )}
            </div>
            <div>
              <select
                {...register("discount_type", {
                  required: "Tipe diskon wajib diisi",
                })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition text-gray-700 bg-white"
              >
                <option value="">Tipe diskon</option>
                <option value="percent">Persen (%)</option>
                <option value="nominal">Nominal (Rp)</option>
              </select>
              {errors.discount_type && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.discount_type.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Nilai diskon"
                type="number"
                {...register("discount_value", {
                  valueAsNumber: true,
                  required: "Nilai diskon wajib diisi",
                  min: { value: 1, message: "Min. 1" },
                })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.discount_value && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.discount_value.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Kuota"
                type="number"
                {...register("quota", {
                  valueAsNumber: true,
                  required: "Kuota wajib diisi",
                  min: { value: 1, message: "Min. 1" },
                })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
              />
              {errors.quota && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.quota.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Berlaku dari"
                type="date"
                {...register("valid_from", {
                  required: "Tanggal mulai wajib diisi",
                })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition text-gray-500"
              />
              {errors.valid_from && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.valid_from.message}
                </div>
              )}
            </div>
            <div>
              <input
                placeholder="Berlaku hingga"
                type="date"
                {...register("valid_until", {
                  required: "Tanggal akhir wajib diisi",
                })}
                className="w-full px-4 py-3 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 shadow-sm transition text-gray-500"
              />
              {errors.valid_until && (
                <div className="text-red-500 text-xs mt-1">
                  {errors.valid_until.message}
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
              {editingId ? "Update" : "Tambah"} Voucher
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
          {vouchers.length === 0 && (
            <div className="text-gray-400 text-center py-12">
              Tidak ada voucher.
            </div>
          )}
          {vouchers.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl shadow-md border border-blue-100 p-5 flex flex-col md:flex-row items-center md:items-stretch justify-between gap-4"
            >
              <div className="flex-1 flex flex-col md:flex-row gap-4 items-center md:items-center">
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-gray-500 font-medium text-xs">
                    Kode Voucher
                  </span>
                  <span className="text-xl font-bold text-blue-700 tracking-wider">
                    {v.code}
                  </span>
                </div>
                <span className="mx-4 hidden md:inline text-gray-400 text-2xl">
                  •
                </span>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-gray-500 font-medium text-xs">
                    Tipe
                  </span>
                  {badgeType(v.discount_type)}
                </div>
                <span className="mx-4 hidden md:inline text-gray-400 text-2xl">
                  •
                </span>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-gray-500 font-medium text-xs">
                    Nilai
                  </span>
                  <span className="font-bold">
                    {v.discount_type === "percent"
                      ? `${v.discount_value}%`
                      : `Rp${Number(v.discount_value).toLocaleString("id-ID")}`}
                  </span>
                </div>
                <span className="mx-4 hidden md:inline text-gray-400 text-2xl">
                  •
                </span>
                <div className="flex flex-col items-center md:items-start">
                  <span className="text-gray-500 font-medium text-xs">
                    Kuota
                  </span>
                  <span className="font-bold">{v.quota}</span>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-500">Dari</span>
                  <div className="font-semibold">
                    {v.valid_from?.slice(0, 10)}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Sampai</span>
                  <div className="font-semibold">
                    {v.valid_until?.slice(0, 10)}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 min-w-[120px] items-end">
                <button
                  className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm shadow transition"
                  onClick={() => handleEdit(v)}
                >
                  Edit
                </button>
                <button
                  className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm shadow transition"
                  onClick={() => handleDelete(v.id)}
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
