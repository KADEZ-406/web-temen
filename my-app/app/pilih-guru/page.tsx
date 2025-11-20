'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { GuruBK, LayananBK } from "@/lib/types";

function PilihGuruContent() {
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
  const [availableSlots, setAvailableSlots] = useState<Array<{start: string, end: string}>>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push('/login');
      return;
    }

    const tanggalParam = searchParams.get('tanggal');
    const waktuMulaiParam = searchParams.get('waktu_mulai');
    const waktuSelesaiParam = searchParams.get('waktu_selesai');

    if (tanggalParam) {
      setTanggal(tanggalParam);
    }
    if (waktuMulaiParam) {
      setWaktuMulai(waktuMulaiParam);
    }
    if (waktuSelesaiParam) {
      setWaktuSelesai(waktuSelesaiParam);
    }

    if (guruId) {
      fetchGuru(parseInt(guruId));
    }
    fetchLayanan();
  }, [guruId, router, searchParams]);

  useEffect(() => {
    if (tanggal && guruId) {
      fetchAvailableSlots(parseInt(guruId), tanggal);
    } else {
      setAvailableSlots([]);
    }
  }, [tanggal, guruId]);

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

  const fetchAvailableSlots = async (guruId: number, tanggal: string) => {
    try {
      setLoadingSlots(true);
      const response = await fetch(`/api/guru/${guruId}/jadwal-tersedia?tanggal=${tanggal}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setAvailableSlots(data.data.available_slots || []);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoadingSlots(false);
    }
  };

  const selectSlot = (start: string, end: string) => {
    setWaktuMulai(start);
    setWaktuSelesai(end);
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
        setTimeout(() => {
          router.push('/home');
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
          <p className="mt-4 text-[#778873]/70">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (!guru) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#778873]/70 mb-4">Guru tidak ditemukan</p>
          <Link href="/home" className="text-[#778873] hover:underline">
            Kembali ke Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#778873] mb-4">Buat Janji Konsultasi</h1>
          <p className="text-[#778873]/70">
            Lengkapi form di bawah untuk membuat jadwal konseling dengan {guru.nama_lengkap}
          </p>
        </div>

        <div className="bg-white border border-[#A1BC98] rounded-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#778873] shrink-0">
              <Image
                src={guru.foto_profil || `https://ui-avatars.com/api/?name=${encodeURIComponent(guru.nama_lengkap)}&size=200&background=2563eb&color=fff`}
                alt={guru.nama_lengkap}
                width={80}
                height={80}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#778873]">{guru.nama_lengkap}</h3>
              <p className="text-[#778873]/70">{guru.spesialisasi}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#A1BC98] rounded-lg p-8">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              <p className="font-semibold">Jadwal konseling berhasil dibuat!</p>
              <p className="text-sm mt-1">Mengalihkan ke dashboard...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Pilih Layanan Konseling <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedLayanan || ''}
                onChange={(e) => setSelectedLayanan(parseInt(e.target.value))}
                required
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              >
                <option value="">Pilih layanan...</option>
                {layanan.map((lay) => (
                  <option key={lay.id} value={lay.id}>
                    {lay.nama_layanan}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Tanggal Konseling <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              />
            </div>

            {tanggal && (
              <div>
                <label className="block text-sm font-medium text-[#778873] mb-2">
                  Pilih Waktu Tersedia <span className="text-red-500">*</span>
                </label>
                {loadingSlots ? (
                  <div className="text-center py-4 text-[#778873]/70">Memuat slot waktu...</div>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => selectSlot(slot.start, slot.end)}
                        className={`px-4 py-2 border rounded transition-colors ${
                          waktuMulai === slot.start && waktuSelesai === slot.end
                            ? 'bg-[#778873] text-white border-[#778873]'
                            : 'bg-white border-[#A1BC98] text-[#778873] hover:bg-[#F1F3E0]'
                        }`}
                      >
                        {slot.start} - {slot.end}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-[#778873]/70">
                    Tidak ada slot waktu tersedia untuk tanggal ini. Silakan pilih tanggal lain.
                  </div>
                )}
              </div>
            )}

            {waktuMulai && waktuSelesai && (
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-4">
                <p className="text-sm text-[#778873]">
                  <span className="font-semibold">Waktu yang dipilih:</span> {waktuMulai} - {waktuSelesai}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Alasan Konseling <span className="text-red-500">*</span>
              </label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                required
                rows={5}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none resize-none"
                placeholder="Jelaskan alasan Anda memerlukan konseling..."
              />
            </div>

            <div className="flex gap-4">
              <Link
                href="/home"
                className="flex-1 px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] text-center transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

export default function PilihGuruPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
          <p className="mt-4 text-[#778873]/70">Memuat...</p>
        </div>
      </div>
    }>
      <PilihGuruContent />
    </Suspense>
  );
}
