"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginWithRole } from "../(actions)/loginWithEmailPassword";

export default function LoginPage() {
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
      router.push("/admin");
    } else if (role === "user") {
      router.push("/dashboard");
    } else {
      setServerError("Role tidak ditemukan, hubungi admin.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto mt-10"
    >
      <h1 className="text-xl font-bold mb-2">Login</h1>
      <input
        placeholder="Email"
        type="email"
        {...register("email", {
          required: "Email is required",
          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
        })}
        className="input input-bordered w-full"
      />
      {errors.email && (
        <div className="text-red-500 text-sm">{errors.email.message}</div>
      )}

      <input
        placeholder="Password"
        type="password"
        {...register("password", { required: "Password is required" })}
        className="input input-bordered w-full"
      />
      {errors.password && (
        <div className="text-red-500 text-sm">{errors.password.message}</div>
      )}

      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
      {serverError && <div className="text-red-500 text-sm">{serverError}</div>}
    </form>
  );
}
