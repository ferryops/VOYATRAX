export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl mx-auto my-8 p-6 rounded shadow bg-white flex flex-col items-center">
        <img
          src="https://dummyimage.com/600x300/ccc/333&text=VoyaTrax"
          alt="VoyaTrax Banner"
          className="mb-6 rounded"
          width={600}
          height={300}
        />
        <h1 className="text-3xl font-bold mb-2 text-blue-700">VoyaTrax</h1>
        <p className="mb-6 text-lg text-gray-700 text-center">
          <b>VoyaTrax</b> adalah aplikasi pemesanan tiket pesawat secara online,
          mudah dan praktis! Dapatkan tiket termurah, cek promo, dan nikmati
          kemudahan memesan tiket dari mana saja.
        </p>
        <div className="grid md:grid-cols-3 gap-4 w-full mb-8">
          <div className="flex flex-col items-center p-3">
            <img
              src="https://dummyimage.com/100x100/eee/000&text=1"
              alt="Pilih tiket"
              className="mb-2 rounded"
            />
            <p className="text-center">
              Pilih dan cari tiket pesawat favoritmu
            </p>
          </div>
          <div className="flex flex-col items-center p-3">
            <img
              src="https://dummyimage.com/100x100/eee/000&text=2"
              alt="Voucher"
              className="mb-2 rounded"
            />
            <p className="text-center">
              Gunakan voucher diskon & promo menarik
            </p>
          </div>
          <div className="flex flex-col items-center p-3">
            <img
              src="https://dummyimage.com/100x100/eee/000&text=3"
              alt="Cetak tiket"
              className="mb-2 rounded"
            />
            <p className="text-center">
              Cetak e-ticket langsung setelah pembayaran
            </p>
          </div>
        </div>
        <div className="flex gap-4 mb-3">
          <a
            href="/login"
            className="btn btn-primary px-8 py-2 rounded text-white bg-blue-600 hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="btn px-8 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-100 transition"
          >
            Daftar
          </a>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          © {new Date().getFullYear()} VoyaTrax. All rights reserved.
        </div>
      </div>
    </div>
  );
}
