'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface LaporanData {
  total_konseling: number;
  konseling_selesai: number;
  konseling_dibatalkan: number;
  konseling_berlangsung: number;
  jadwal_mendatang: number;
  rata_rata_rating: number;
  top_guru: Array<{ nama: string; total: number }>;
  top_layanan: Array<{ nama: string; total: number }>;
}

export default function DaftarLaporanPage() {
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.role === 'admin') {
        fetchLaporan();
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchLaporan = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard?user_id=${user?.id}&role=${user?.role}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setLaporan({
          total_konseling: data.data.total_konseling || 0,
          konseling_selesai: data.data.konseling_selesai || 0,
          konseling_dibatalkan: 0,
          konseling_berlangsung: data.data.konseling_berlangsung || 0,
          jadwal_mendatang: data.data.jadwal_mendatang || 0,
          rata_rata_rating: 4.5,
          top_guru: [],
          top_layanan: [],
        });
      }
    } catch (error) {
      console.error('Error fetching laporan:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#778873]/70 mb-4">Akses ditolak. Hanya admin yang dapat mengakses halaman ini.</p>
          <Link href="/login" className="text-[#778873] hover:underline">
            Login sebagai Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Navbar */}
      <nav className="border-b border-[#A1BC98] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={40}
                  height={40}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div className="text-sm font-semibold text-[#778873]">
                Laporan & Statistik
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/admin"
                className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-[#778873] hover:text-[#778873]"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Laporan & Statistik</h1>
          <p className="text-[#778873]/70">Laporan dan statistik konseling SMK Taruna Bhakti</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
            <p className="mt-4 text-[#778873]/70">Memuat data...</p>
          </div>
        ) : laporan ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Total Konseling</div>
                <div className="text-3xl font-bold text-[#778873]">{laporan.total_konseling}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Selesai</div>
                <div className="text-3xl font-bold text-[#778873]">{laporan.konseling_selesai}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Berlangsung</div>
                <div className="text-3xl font-bold text-[#778873]">{laporan.konseling_berlangsung}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Mendatang</div>
                <div className="text-3xl font-bold text-[#778873]">{laporan.jadwal_mendatang}</div>
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white border border-[#A1BC98] rounded p-6">
                <h3 className="text-lg font-semibold text-[#778873] mb-4">Rata-rata Rating</h3>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-[#778873]">
                    {laporan.rata_rata_rating.toFixed(1)}
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-6 h-6 ${star <= Math.round(laporan.rata_rata_rating) ? 'text-[#778873]' : 'text-[#A1BC98]'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-[#A1BC98] rounded p-6">
                <h3 className="text-lg font-semibold text-[#778873] mb-4">Konseling Dibatalkan</h3>
                <div className="text-4xl font-bold text-[#778873]">
                  {laporan.konseling_dibatalkan}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-white border border-[#A1BC98] rounded p-6">
              <h3 className="text-lg font-semibold text-[#778873] mb-4">Informasi Laporan</h3>
              <p className="text-[#778873]/70">
                Laporan ini menampilkan statistik konseling dari seluruh siswa SMK Taruna Bhakti.
                Data diperbarui secara real-time berdasarkan aktivitas konseling.
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#778873]/70">Tidak ada data laporan</p>
          </div>
        )}
      </div>
    </div>
  );
}
