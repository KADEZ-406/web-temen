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

interface DashboardGuru {
  total_jadwal: number;
  jadwal_hari_ini: number;
  jadwal_mendatang: number;
  jadwal_selesai: number;
  jadwal_berlangsung: number;
}

export default function GuruDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardGuru | null>(null);
  const [jadwalMendatang, setJadwalMendatang] = useState<JadwalKonseling[]>([]);
  const [jadwalHariIni, setJadwalHariIni] = useState<JadwalKonseling[]>([]);
  const [jadwalMenunggu, setJadwalMenunggu] = useState<JadwalKonseling[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [guruId, setGuruId] = useState<number | null>(null);
  const toast = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        if (parsedUser.role !== 'guru') {
          setLoading(false);
          return;
        }
        fetchGuruId(parsedUser.id);
      } catch (parseError) {
        console.error('Error parsing user data:', parseError);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (guruId) {
      fetchDashboardData(guruId);
      fetchJadwalMendatang(guruId);
      fetchJadwalHariIni(guruId);
      fetchJadwalMenunggu(guruId);
      
      const interval = setInterval(() => {
        fetchDashboardData(guruId);
        fetchJadwalMendatang(guruId);
        fetchJadwalHariIni(guruId);
        fetchJadwalMenunggu(guruId);
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [guruId]);

  const fetchGuruId = async (userId: number) => {
    try {
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data) {
        const guru = data.data.find((g: any) => g.user_id === userId);
        if (guru) {
          setGuruId(guru.id);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching guru ID:', error);
      setLoading(false);
    }
  };

  const fetchDashboardData = async (guruId: number) => {
    try {
      const response = await fetch(`/api/dashboard?user_id=${guruId}&role=guru`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setDashboardData(data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJadwalMendatang = async (guruId: number) => {
    try {
      const response = await fetch(`/api/jadwal?guru_id=${guruId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const today = new Date().toISOString().split('T')[0];
        const upcoming = data.data
          .filter((jadwal: JadwalKonseling) => {
            const status = jadwal.status || 'menunggu';
            const validStatuses = ['dijadwalkan', 'berlangsung'];
            if (!validStatuses.includes(status)) return false;
            
            const jadwalDate = new Date(`${jadwal.tanggal} ${jadwal.waktu_mulai}`);
            return jadwalDate >= new Date();
          })
          .sort((a: JadwalKonseling, b: JadwalKonseling) => {
            const dateA = new Date(`${a.tanggal} ${a.waktu_mulai}`).getTime();
            const dateB = new Date(`${b.tanggal} ${b.waktu_mulai}`).getTime();
            return dateA - dateB;
          })
          .slice(0, 5);
        
        setJadwalMendatang(upcoming);
      }
    } catch (error) {
      console.error('Error fetching jadwal:', error);
    }
  };

  const fetchJadwalHariIni = async (guruId: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(`/api/jadwal?guru_id=${guruId}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const todayJadwal = data.data.filter((jadwal: JadwalKonseling) => {
          return jadwal.tanggal === today && (jadwal.status === 'dijadwalkan' || jadwal.status === 'berlangsung');
        });
        setJadwalHariIni(todayJadwal);
      }
    } catch (error) {
      console.error('Error fetching jadwal hari ini:', error);
    }
  };

  const fetchJadwalMenunggu = async (guruId: number) => {
    try {
      const response = await fetch(`/api/jadwal?guru_id=${guruId}&status=menunggu`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setJadwalMenunggu(data.data);
      }
    } catch (error) {
      console.error('Error fetching jadwal menunggu:', error);
    }
  };

  const approveJadwal = async (jadwalId: number) => {
    try {
      const response = await fetch(`/api/jadwal/${jadwalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'dijadwalkan' }),
      });

      const data = await response.json();
      
      if (data.success) {
        if (guruId) {
          fetchJadwalMenunggu(guruId);
          fetchJadwalMendatang(guruId);
          fetchDashboardData(guruId);
        }
        toast.success('Jadwal berhasil disetujui');
      } else {
        toast.error(data.message || 'Gagal menyetujui jadwal');
      }
    } catch (error) {
      console.error('Error approving jadwal:', error);
      toast.error('Terjadi kesalahan saat menyetujui jadwal');
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
        if (guruId) {
          fetchJadwalMenunggu(guruId);
          fetchJadwalMendatang(guruId);
          fetchJadwalHariIni(guruId);
          fetchDashboardData(guruId);
        }
        toast.success('Status jadwal berhasil diupdate');
      } else {
        toast.error(data.message || 'Gagal mengupdate status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Terjadi kesalahan saat mengupdate status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#778873]"></div>
          <p className="mt-4 text-[#778873]/70">Memuat dashboard...</p>
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
      {/* Simple Navbar */}
      <nav className="border-b border-[#A1BC98] bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
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
                Dashboard Guru BK
              </div>
            </Link>
            <div className="flex items-center gap-3">
              <Link
                href="/guru/dashboard"
                className="px-4 py-2 text-[#778873] border border-[#778873] rounded hover:bg-[#778873] hover:text-white transition-colors"
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
          <h1 className="text-3xl font-bold text-[#778873] mb-2">Dashboard Guru BK</h1>
          <p className="text-[#778873]/70">Selamat datang, {user.nama_lengkap}</p>
        </div>

        {/* Stats Grid */}
        {dashboardData ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Total Jadwal</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.total_jadwal || 0}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Hari Ini</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.jadwal_hari_ini || 0}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Mendatang</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.jadwal_mendatang || 0}</div>
              </div>
              <div className="bg-[#F1F3E0] border border-[#A1BC98] rounded p-6">
                <div className="text-sm text-[#778873]/70 mb-1">Selesai</div>
                <div className="text-3xl font-bold text-[#778873]">{dashboardData.jadwal_selesai || 0}</div>
              </div>
            </div>

            {/* Jadwal Menunggu Persetujuan */}
            {jadwalMenunggu.length > 0 && (
              <div className="bg-white border border-[#A1BC98] rounded mb-8">
                <div className="px-6 py-4 border-b border-[#A1BC98]">
                  <h2 className="text-xl font-semibold text-[#778873]">Jadwal Menunggu Persetujuan</h2>
                </div>
                <div className="divide-y divide-[#D2DCB6]">
                  {jadwalMenunggu.map((jadwal) => (
                    <div key={jadwal.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-[#778873] mb-1">{jadwal.nama_siswa}</div>
                          <div className="text-sm text-[#778873]/70 mb-1">NISN: {jadwal.nisn}</div>
                          <div className="text-sm text-[#778873]/70 mb-1">Layanan: {jadwal.nama_layanan}</div>
                          <div className="text-sm text-[#778873]/70">
                            {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })} • {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                          </div>
                          {jadwal.alasan_konseling && (
                            <div className="text-sm text-[#778873]/70 mt-2">Alasan: {jadwal.alasan_konseling}</div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => approveJadwal(jadwal.id)}
                            className="px-4 py-2 bg-[#778873] hover:bg-[#778873] text-white rounded transition-colors"
                          >
                            Setujui
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Apakah Anda yakin ingin menolak jadwal ini?')) {
                                updateStatus(jadwal.id, 'dibatalkan');
                              }
                            }}
                            className="px-4 py-2 border border-[#778873] text-[#778873] hover:bg-[#F1F3E0] rounded transition-colors"
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jadwal Hari Ini */}
            {jadwalHariIni.length > 0 && (
              <div className="bg-white border border-[#A1BC98] rounded mb-8">
                <div className="px-6 py-4 border-b border-[#A1BC98]">
                  <h2 className="text-xl font-semibold text-[#778873]">Jadwal Hari Ini</h2>
                </div>
                <div className="divide-y divide-[#D2DCB6]">
                  {jadwalHariIni.map((jadwal) => (
                    <div key={jadwal.id} className="px-6 py-4">
                      <div className="font-medium text-[#778873] mb-1">{jadwal.nama_siswa}</div>
                      <div className="text-sm text-[#778873]/70 mb-1">NISN: {jadwal.nisn}</div>
                      <div className="text-sm text-[#778873]/70 mb-1">Layanan: {jadwal.nama_layanan}</div>
                      <div className="text-sm text-[#778873]/70">
                        {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Jadwal Mendatang */}
            {jadwalMendatang.length > 0 && (
              <div className="bg-white border border-[#A1BC98] rounded">
                <div className="px-6 py-4 border-b border-[#A1BC98]">
                  <h2 className="text-xl font-semibold text-[#778873]">Jadwal Mendatang</h2>
                </div>
                <div className="divide-y divide-[#D2DCB6]">
                  {jadwalMendatang.map((jadwal) => (
                    <div key={jadwal.id} className="px-6 py-4">
                      <div className="font-medium text-[#778873] mb-1">{jadwal.nama_siswa}</div>
                      <div className="text-sm text-[#778873]/70 mb-1">NISN: {jadwal.nisn}</div>
                      <div className="text-sm text-[#778873]/70 mb-1">Layanan: {jadwal.nama_layanan}</div>
                      <div className="text-sm text-[#778873]/70">
                        {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })} • {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {jadwalMenunggu.length === 0 && jadwalHariIni.length === 0 && jadwalMendatang.length === 0 && (
              <div className="bg-white border border-[#A1BC98] rounded p-12 text-center">
                <p className="text-[#778873]/70">Tidak ada jadwal konseling</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#778873]/70">Tidak ada data dashboard</p>
          </div>
        )}
      </div>
    </div>
  );
}
