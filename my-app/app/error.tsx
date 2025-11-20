'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-[#778873] mb-4">Terjadi Kesalahan</h2>
        <p className="text-[#778873]/70 mb-6">
          {error.message || 'Terjadi kesalahan yang tidak diketahui'}
        </p>
        <button
          onClick={reset}
          className="px-6 py-2 bg-[#778873] text-white rounded hover:bg-[#778873]/90 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}

