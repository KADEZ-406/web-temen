'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { GuruBK, LayananBK } from "@/lib/types/database";

export default function PilihGuruPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const guruId = searchParams.get('guru_id');
  
  const [guru, setGuru] = useState<GuruBK | null>(null);
  const [layanan, setLayanan] = useState<LayananBK[]>([]);
  const [selectedLayanan, setSelectedLayanan] = useState<number | null>(null);
  const [tanggal, setTanggal] = useState('');
  const [waktuMulai, setWaktuMulai] = useState('');
  const [waktuSelesai, setWaktuSelesai] = useState('');
  const [alasan, setAlasan] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login/user');
      return;
    }

    if (guruId) {
      fetchGuru(parseInt(guruId));
    }
    fetchLayanan();
  }, [guruId, router]);

  const fetchGuru = async (id: number) => {
    try {
      const response = await fetch(`/api/guru?is_active=true`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const foundGuru = data.data.find((g: GuruBK) => g.id === id);
        if (foundGuru) {
          setGuru(foundGuru);
        }
      }
    } catch (error) {
      console.error('Error fetching guru:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchLayanan = async () => {
    try {
      const response = await fetch('/api/layanan');
      const data = await response.json();
      
      if (data.success && data.data) {
        setLayanan(data.data);
      }
    } catch (error) {
      console.error('Error fetching layanan:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    if (!user) {
      setError('Anda harus login terlebih dahulu');
      setSubmitting(false);
      return;
    }

    if (!guruId || !selectedLayanan || !tanggal || !waktuMulai || !waktuSelesai || !alasan) {
      setError('Semua field harus diisi');
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/jadwal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          siswa_id: user.id,
          guru_id: parseInt(guruId),
          layanan_id: selectedLayanan,
          tanggal: tanggal,
          waktu_mulai: waktuMulai,
          waktu_selesai: waktuSelesai,
          alasan_konseling: alasan,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        // Redirect setelah 2 detik
        setTimeout(() => {
          router.push('/home/dasboard');
        }, 2000);
      } else {
        setError(data.message || 'Gagal membuat jadwal konseling');
      }
    } catch (err: any) {
      setError('Terjadi kesalahan saat membuat jadwal');
      console.error('Error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-400 ">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!guru) {
    return (
      <div className="min-h-screen bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Guru tidak ditemukan</p>
          <Link href="/home" className="text-blue-600  hover:underline">
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 py-12 px-6 transition-colors duration-300">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-gray-900/90  backdrop-blur-sm rounded-lg shadow-md transition-colors duration-300">
          
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 transition-colors duration-300">
            Buat Janji Konsultasi
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto transition-colors duration-300">
            Lengkapi form di bawah untuk membuat jadwal konseling dengan {guru.nama_lengkap}
          </p>
        </div>

        {/* Guru Info Card */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-6 mb-8 border border-gray-700 ">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-blue-500  flex-shrink-0">
              <Image
                src={guru.foto_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama_lengkap)}&size=200&background=3b82f6&color=fff`}
                alt={guru.nama_lengkap}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white ">{guru.nama_lengkap}</h3>
              <p className="text-gray-400 ">{guru.spesialisasi}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl shadow-lg p-8 border border-gray-700 ">
          {success && (
            <div className="bg-green-50  border border-green-200  text-green-700  px-4 py-3 rounded-lg mb-6">
              <p className="font-semibold">Jadwal konseling berhasil dibuat!</p>
              <p className="text-sm mt-1">Mengalihkan ke dashboard...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50  border border-red-200  text-red-700  px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Pilih Layanan */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Pilih Layanan Konseling <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedLayanan || ''}
                onChange={(e) => setSelectedLayanan(parseInt(e.target.value))}
                required
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white "
              >
                <option value="">Pilih layanan...</option>
                {layanan.map((lay) => (
                  <option key={lay.id} value={lay.id}>
                    {lay.nama_layanan}
                  </option>
                ))}
              </select>
            </div>

            {/* Tanggal */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Tanggal Konseling <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white "
              />
            </div>

            {/* Waktu */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Waktu Mulai <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={waktuMulai}
                  onChange={(e) => setWaktuMulai(e.target.value)}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white "
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Waktu Selesai <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  value={waktuSelesai}
                  onChange={(e) => setWaktuSelesai(e.target.value)}
                  required
                  min={waktuMulai}
                  className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white "
                />
              </div>
            </div>

            {/* Alasan */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                Alasan Konseling <span className="text-red-500">*</span>
              </label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-gray-900 text-white resize-none"
                placeholder="Jelaskan alasan Anda memerlukan konseling..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Link
                href="/home"
                className="flex-1 px-4 py-3 bg-gray-200  hover:bg-gray-600 text-white rounded-lg font-semibold text-center transition-colors duration-300"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Menyimpan...' : 'Buat Jadwal Konseling'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
