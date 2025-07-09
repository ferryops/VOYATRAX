"use client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import Image from "next/image";

export default function Home() {
  useDocumentTitle("VoyaTrax - Aplikasi Pemesanan Tiket Pesawat");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="w-full mx-auto px-12 my-10 py-10 rounded-2xl shadow-lg bg-white flex flex-col items-center border border-blue-100">
        <div className="flex flex-col items-center gap-2 mb-5">
          <div className="bg-blue-100 w-16 h-16 flex items-center justify-center rounded-full shadow mb-2 text-4xl">
            ✈️
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-blue-600 tracking-tight">
            VoyaTrax
          </h1>
        </div>

        <Image
          src="https://images.unsplash.com/photo-1569629743817-70d8db6c323b"
          alt="VoyaTrax Banner"
          className="mb-6 rounded-xl border border-blue-100 shadow"
          width={600}
          height={300}
        />

        <p className="mb-7 text-lg text-gray-700 text-center max-w-2xl">
          <b>VoyaTrax</b> adalah aplikasi pemesanan tiket pesawat secara online,
          mudah & praktis! Dapatkan tiket termurah, cek promo, dan nikmati
          kemudahan memesan tiket dari mana saja.
        </p>

        <div className="grid md:grid-cols-3 gap-5 w-full mb-9">
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
            <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-full mb-3 text-lg font-bold text-blue-700 shadow">
              1
            </div>
            <p className="text-center font-medium text-gray-600">
              Pilih & cari tiket pesawat favoritmu
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
            <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-full mb-3 text-lg font-bold text-blue-700 shadow">
              2
            </div>
            <p className="text-center font-medium text-gray-600">
              Gunakan voucher diskon & promo menarik
            </p>
          </div>
          <div className="flex flex-col items-center p-3 bg-blue-50 rounded-xl shadow-sm border border-blue-100">
            <div className="bg-blue-100 w-14 h-14 flex items-center justify-center rounded-full mb-3 text-lg font-bold text-blue-700 shadow">
              3
            </div>
            <p className="text-center font-medium text-gray-600">
              Cetak e-ticket langsung setelah pembayaran
            </p>
          </div>
        </div>

        <div className="flex gap-4 mb-3 w-full justify-center">
          <a
            href="/login"
            className="px-8 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base shadow-md transition w-full md:w-auto text-center"
          >
            Login
          </a>
          <a
            href="/register"
            className="px-8 py-3 rounded-xl border border-blue-500 text-blue-600 hover:bg-blue-100 hover:border-blue-600 font-semibold text-base shadow-md transition w-full md:w-auto text-center"
          >
            Daftar
          </a>
        </div>

        <div className="mt-3 text-sm text-gray-400">
          © {new Date().getFullYear()} VoyaTrax. All rights reserved.
        </div>
      </div>
    </div>
  );
}
