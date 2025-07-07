"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerWithEmailPassword } from "../(actions)/registerWithEmailPassword";

export default function RegisterPage() {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 max-w-sm mx-auto mt-10"
    >
      <h1 className="text-xl font-bold mb-2">Register</h1>
      <input
        placeholder="Full Name"
        {...register("name", { required: "Name is required" })}
        className="input input-bordered w-full"
      />
      {errors.name && (
        <div className="text-red-500 text-sm">{errors.name.message}</div>
      )}

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
        {...register("password", {
          required: "Password is required",
          minLength: { value: 6, message: "Min 6 characters" },
        })}
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
        {isSubmitting ? "Registering..." : "Register"}
      </button>
      {serverError && <div className="text-red-500 text-sm">{serverError}</div>}
    </form>
  );
}
