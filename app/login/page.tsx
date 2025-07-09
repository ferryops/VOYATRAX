"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginWithRole } from "../(actions)/loginWithEmailPassword";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Login Akun");
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    setServerError("");
    const email = data.email.trim().toLowerCase();

    const { error, role } = await loginWithRole(email, data.password);

    if (error) {
      setServerError(error.message);
      return;
    }

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "user") {
      router.push("/tickets");
    } else {
      setServerError("Role tidak ditemukan, hubungi admin.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-8 py-8 rounded-2xl shadow-lg max-w-md w-full space-y-6 border border-blue-100"
      >
        <div className="flex flex-col items-center gap-2 mb-4">
          <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-full shadow mb-1 text-3xl">
            ✈️
          </div>
          <h1 className="text-2xl font-extrabold text-blue-600 mb-1">
            Login Akun
          </h1>
          <span className="text-gray-400 text-sm">
            Masuk untuk mulai pesan tiket.
          </span>
        </div>

        <div>
          <input
            placeholder="Email"
            type="email"
            autoComplete="email"
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
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
            placeholder="Password"
            type="password"
            autoComplete="current-password"
            {...register("password", { required: "Password is required" })}
            className="block w-full px-4 py-3 rounded-xl border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm transition placeholder-gray-400"
          />
          {errors.password && (
            <div className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <a
            href="/forgot-password"
            className="text-xs text-blue-500 hover:underline font-medium"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base transition shadow-md disabled:opacity-70"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
        {serverError && (
          <div className="text-red-500 text-sm text-center">{serverError}</div>
        )}

        <div className="text-center text-sm mt-3 text-gray-400">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:underline font-semibold"
          >
            Register
          </a>
        </div>
      </form>
    </div>
  );
}
