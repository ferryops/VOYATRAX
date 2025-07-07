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

type VoucherFormInput = {
  code: string;
  discount_type: string;
  discount_value: number;
  quota: number;
  valid_from: string;
  valid_until: string;
};

export default function AdminVouchers() {
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

  return (
    <div>
      <h2>CRUD Voucher</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          placeholder="Kode"
          {...register("code", { required: "Kode voucher wajib diisi" })}
        />
        <select
          {...register("discount_type", {
            required: "Tipe diskon wajib diisi",
          })}
        >
          <option value="">Pilih tipe diskon</option>
          <option value="percent">Persen (%)</option>
          <option value="nominal">Nominal (Rp)</option>
        </select>
        <input
          placeholder="Nilai diskon"
          type="number"
          {...register("discount_value", {
            valueAsNumber: true,
            required: "Nilai diskon wajib diisi",
            min: { value: 1, message: "Min. 1" },
          })}
        />
        <input
          placeholder="Kuota"
          type="number"
          {...register("quota", {
            valueAsNumber: true,
            required: "Kuota wajib diisi",
            min: { value: 1, message: "Min. 1" },
          })}
        />
        <input
          placeholder="Berlaku dari"
          type="date"
          {...register("valid_from", { required: "Tanggal mulai wajib diisi" })}
        />
        <input
          placeholder="Berlaku hingga"
          type="date"
          {...register("valid_until", {
            required: "Tanggal akhir wajib diisi",
          })}
        />
        <button type="submit" disabled={isSubmitting}>
          {editingId ? "Update" : "Tambah"} Voucher
        </button>
        <button type="button" onClick={handleReset}>
          Reset
        </button>
      </form>
      {/* Tampilkan error validasi */}
      {Object.values(errors).map((err, i) => (
        <div key={i} style={{ color: "red" }}>
          {(err as any).message}
        </div>
      ))}
      {error && <div style={{ color: "red" }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Tipe</th>
            <th>Nilai</th>
            <th>Kuota</th>
            <th>Dari</th>
            <th>Sampai</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {vouchers.map((v) => (
            <tr key={v.id}>
              <td>{v.code}</td>
              <td>{v.discount_type}</td>
              <td>{v.discount_value}</td>
              <td>{v.quota}</td>
              <td>{v.valid_from}</td>
              <td>{v.valid_until}</td>
              <td>
                <button onClick={() => handleEdit(v)}>Edit</button>
                <button onClick={() => handleDelete(v.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
