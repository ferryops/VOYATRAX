export default function Footer() {
  return (
    <footer className="w-full border-t border-blue-100 bg-gradient-to-br from-blue-50 to-white mt-10 py-6">
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center gap-2 px-4">
        <div className="flex items-center gap-2 text-lg text-blue-600 font-extrabold">
          <span className="bg-blue-100 p-2 rounded-full text-xl shadow">
            ✈️
          </span>
          VoyaTrax
        </div>
        <div className="text-gray-500 text-sm text-center">
          Pemesanan tiket pesawat mudah & murah, hanya di VoyaTrax.
        </div>
        <div className="text-gray-400 text-xs text-center">
          © {new Date().getFullYear()} VoyaTrax. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
