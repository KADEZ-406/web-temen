export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#778873] mb-4">404</h1>
        <p className="text-[#778873]/70 mb-8">Halaman tidak ditemukan</p>
        <a
          href="/"
          className="px-6 py-2 bg-[#778873] text-white rounded hover:bg-[#778873]/90 transition-colors"
        >
          Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}

