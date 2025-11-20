'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useToast } from "@/app/contexts/ToastContext";

interface JadwalKonseling {
  id: number;
  siswa_id: number;
  guru_id: number;
  layanan_id: number;
  tanggal: string;
  waktu_mulai: string;
  waktu_selesai: string;
  alasan_konseling: string;
  status: string;
  nama_siswa: string;
  nisn: string;
  nama_layanan: string;
  created_at: string;
}

export default function GuruJadwalPage() {
  const [jadwal, setJadwal] = useState<JadwalKonseling[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [user, setUser] = useState<any>(null);
  const [guruId, setGuruId] = useState<number | null>(null);
  const toast = useToast();

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

  useEffect(() => {
    if (guruId) {
      fetchJadwal();
      
      const interval = setInterval(() => {
        fetchJadwal();
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [guruId, filterStatus]);

  const fetchGuruId = async (userId: number) => {
    try {
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data) {
        const guru = data.data.find((g: any) => g.user_id === userId);
        if (guru) {
          setGuruId(guru.id);
        }
      }
    } catch (error) {
      console.error('Error fetching guru ID:', error);
      setLoading(false);
    }
  };

  const fetchJadwal = async () => {
    if (!guruId) return;
    
    try {
      setLoading(true);
      let url = `/api/jadwal?guru_id=${guruId}`;
      if (filterStatus) {
        url += `&status=${encodeURIComponent(filterStatus)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        setJadwal(data.data);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (jadwalId: number, newStatus: string) => {
    try {
      const response = await fetch(`/api/jadwal/${jadwalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();
      
      if (data.success) {
        setJadwal(prevJadwal => 
          prevJadwal.map(j => 
            j.id === jadwalId ? { ...j, status: newStatus } : j
          )
        );
        await fetchJadwal();
        toast.success('Status jadwal berhasil diupdate');
      } else {
        toast.error(data.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Terjadi kesalahan saat mengupdate status');
    }
  };

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
      {/* Simple Navbar */}
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
                  unoptimized
                />
              </div>
              <div className="text-sm font-semibold text-[#778873]">
                Jadwal Konseling
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
                className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
              >
                Jadwal
              </Link>
              <Link
                href="/guru/pengaturan"
                className="px-4 py-2 text-[#778873] hover:text-[#778873]"
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

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Jadwal Konseling</h1>
          <p className="text-[#778873]/70">Kelola semua jadwal konseling Anda</p>
        </div>

        {/* Filter */}
        <div className="bg-white border border-[#A1BC98] rounded p-4 mb-6">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-[#778873]">Filter Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-[#A1BC98] rounded focus:ring-2 focus:ring-[#778873] focus:border-[#778873] outline-none"
            >
              <option value="">Semua Status</option>
              <option value="menunggu">Menunggu</option>
              <option value="dijadwalkan">Dijadwalkan</option>
              <option value="berlangsung">Berlangsung</option>
              <option value="selesai">Selesai</option>
              <option value="dibatalkan">Dibatalkan</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-[#A1BC98] rounded overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
              <p className="mt-4 text-[#778873]/70">Memuat data...</p>
            </div>
          ) : jadwal.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-[#778873]/70">Tidak ada jadwal konseling</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F3E0] border-b border-[#A1BC98]">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Tanggal</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Waktu</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Siswa</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Layanan</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-[#778873]">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D2DCB6]">
                  {jadwal.map((j) => (
                    <tr key={j.id} className="hover:bg-[#F1F3E0]">
                      <td className="px-6 py-4 text-[#778873]/70">
                        {new Date(j.tanggal).toLocaleDateString('id-ID', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </td>
                      <td className="px-6 py-4 text-[#778873]/70">
                        {j.waktu_mulai} - {j.waktu_selesai}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-[#778873]">{j.nama_siswa}</div>
                          <div className="text-sm text-[#778873]/70">NISN: {j.nisn}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[#778873]/70">{j.nama_layanan}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded text-xs font-medium bg-[#D2DCB6] text-[#778873]">
                          {j.status ? (j.status.charAt(0).toUpperCase() + j.status.slice(1)) : 'Menunggu'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {(j.status === 'menunggu' || !j.status) && (
                            <>
                              <button
                                onClick={() => updateStatus(j.id, 'dijadwalkan')}
                                className="px-3 py-1 bg-[#778873] hover:bg-[#778873] text-white rounded text-sm transition-colors"
                              >
                                Setujui
                              </button>
                              <button
                                onClick={() => updateStatus(j.id, 'dibatalkan')}
                                className="px-3 py-1 border border-[#778873] text-[#778873] hover:bg-[#F1F3E0] rounded text-sm transition-colors"
                              >
                                Tolak
                              </button>
                            </>
                          )}
                          {j.status === 'dijadwalkan' && (
                            <>
                              <button
                                onClick={() => updateStatus(j.id, 'berlangsung')}
                                className="px-3 py-1 bg-[#778873] hover:bg-[#778873] text-white rounded text-sm transition-colors"
                              >
                                Mulai
                              </button>
                              <button
                                onClick={() => updateStatus(j.id, 'dibatalkan')}
                                className="px-3 py-1 border border-[#778873] text-[#778873] hover:bg-[#F1F3E0] rounded text-sm transition-colors"
                              >
                                Batal
                              </button>
                            </>
                          )}
                          {j.status === 'berlangsung' && (
                            <button
                              onClick={() => updateStatus(j.id, 'selesai')}
                              className="px-3 py-1 bg-[#778873] hover:bg-[#778873] text-white rounded text-sm transition-colors"
                            >
                              Selesai
                            </button>
                          )}
                          {(j.status === 'selesai' || j.status === 'dibatalkan') && (
                            <span className="text-xs text-[#778873]/70 italic">
                              {j.status === 'selesai' ? 'Selesai' : 'Dibatalkan'}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
