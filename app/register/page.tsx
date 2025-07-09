"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerWithEmailPassword } from "../(actions)/registerWithEmailPassword";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function RegisterPage() {
  useDocumentTitle("Daftar Akun Baru");
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    setServerError("");
    const email = data.email.trim().toLowerCase();
    const { error } = await registerWithEmailPassword(
      data.name,
      email,
      data.password
    );
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-8 py-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 border border-blue-100"
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-full shadow mb-1 text-3xl">
            🎫
          </div>
          <h1 className="text-2xl font-extrabold text-blue-600 mb-1">
            Buat Akun Baru
          </h1>
          <span className="text-gray-400 text-sm text-center">
            Daftar untuk mulai pesan tiket.
          </span>
        </div>

        <div>
          <input
            placeholder="Nama Lengkap"
            autoComplete="name"
            {...register("name", { required: "Nama wajib diisi" })}
            className="block w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
          />
          {errors.name && (
            <div className="text-red-500 text-xs mt-1">
              {errors.name.message}
            </div>
          )}
        </div>

        <div>
          <input
            placeholder="Email"
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "Email wajib diisi",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Format email tidak valid",
              },
            })}
            className="block w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
          />
          {errors.email && (
            <div className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </div>
          )}
        </div>

        <div>
          <input
            placeholder="Password (min. 6 karakter)"
            type="password"
            autoComplete="new-password"
            {...register("password", {
              required: "Password wajib diisi",
              minLength: { value: 6, message: "Minimal 6 karakter" },
            })}
            className="block w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
          />
          {errors.password && (
            <div className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition shadow-md disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Mendaftarkan..." : "Daftar"}
        </button>

        {serverError && (
          <div className="text-red-500 text-sm text-center">{serverError}</div>
        )}

        <div className="text-center text-sm mt-3 text-gray-400">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="text-blue-500 hover:underline font-semibold"
          >
            Login di sini
          </a>
        </div>
      </form>
    </div>
  );
}
