'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/app/contexts/ToastContext";

interface UserData {
  id: number;
  role: string;
  nama_lengkap?: string;
}

export default function GuruPengaturanPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [guruId, setGuruId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [batasPertemuan, setBatasPertemuan] = useState(10);
  const [hariLibur, setHariLibur] = useState<string[]>([]);
  const [statusGuru, setStatusGuru] = useState('aktif');
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const daysOfWeek = [
    { value: 'senin', label: 'Senin' },
    { value: 'selasa', label: 'Selasa' },
    { value: 'rabu', label: 'Rabu' },
    { value: 'kamis', label: 'Kamis' },
    { value: 'jumat', label: 'Jumat' },
    { value: 'sabtu', label: 'Sabtu' },
    { value: 'minggu', label: 'Minggu' },
  ];

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser.role !== 'guru') {
        setLoading(false);
        return;
      }
      
      fetchGuruId(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchGuruId = async (userId: number) => {
    try {
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data && Array.isArray(data.data)) {
        const guru = data.data.find((g: { user_id?: number; id?: number; is_active?: boolean }) => g.user_id === userId);
        if (guru && guru.id) {
          setGuruId(guru.id);
          setStatusGuru(guru.is_active ? 'aktif' : 'tidak_aktif');
        }
      }
    } catch (error) {
      console.error('Error fetching guru ID:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleHariLiburChange = (day: string) => {
    if (hariLibur.includes(day)) {
      setHariLibur(hariLibur.filter(d => d !== day));
    } else {
      setHariLibur([...hariLibur, day]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guruId) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/guru/${guruId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batas_pertemuan: batasPertemuan,
          hari_libur: hariLibur,
          status: statusGuru,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Pengaturan berhasil disimpan!');
      } else {
        toast.error(data.message || 'Gagal menyimpan pengaturan');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Terjadi kesalahan saat menyimpan pengaturan');
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

  if (!user || user.role !== 'guru') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#778873]/70 mb-4">Akses ditolak. Hanya guru BK yang dapat mengakses halaman ini.</p>
          <Link href="/login" className="text-[#778873] hover:underline">
            Login sebagai Guru BK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-[#A1BC98] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/guru/dashboard" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                  unoptimized
                />
              </div>
              <div className="text-sm font-semibold text-[#778873]">
                Guru BK Dashboard
              </div>
            </Link>
                   <div className="flex items-center gap-3">
                     <Link
                       href="/guru/dashboard"
                       className="px-4 py-2 text-[#778873] hover:text-[#778873]"
                     >
                       Dashboard
                     </Link>
                     <Link
                       href="/guru/jadwal"
                       className="px-4 py-2 text-[#778873] hover:text-[#778873]"
                     >
                       Jadwal
                     </Link>
                     <Link
                       href="/guru/pengaturan"
                       className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
                     >
                       Pengaturan
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

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Pengaturan Jadwal</h1>
          <p className="text-[#778873]/70">Atur jadwal BK, batas pertemuan, hari libur, dan status Anda</p>
        </div>

        <div className="bg-white border border-[#A1BC98] rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Batas Pertemuan per Hari
              </label>
              <input
                type="number"
                value={batasPertemuan}
                onChange={(e) => setBatasPertemuan(parseInt(e.target.value))}
                min={1}
                max={20}
                required
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              />
              <p className="text-xs text-[#778873]/70 mt-1">Jumlah maksimal pertemuan yang dapat dilakukan dalam satu hari</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Hari Libur
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {daysOfWeek.map((day) => (
                  <label
                    key={day.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={hariLibur.includes(day.value)}
                      onChange={() => handleHariLiburChange(day.value)}
                      className="w-4 h-4 text-[#778873] border-[#A1BC98] rounded focus:ring-[#778873]"
                    />
                    <span className="text-sm text-[#778873]">{day.label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-[#778873]/70 mt-1">Pilih hari di mana Anda tidak dapat melakukan pertemuan</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#778873] mb-2">
                Status Guru BK
              </label>
              <select
                value={statusGuru}
                onChange={(e) => setStatusGuru(e.target.value)}
                className="w-full px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
              >
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
                <option value="istirahat">Istirahat</option>
                <option value="cuti">Cuti</option>
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              <Link
                href="/guru/dashboard"
                className="flex-1 px-4 py-2 border border-[#778873] text-[#778873] rounded hover:bg-[#F1F3E0] text-center transition-colors"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Pengaturan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

