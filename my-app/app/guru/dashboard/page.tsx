'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [guruId, setGuruId] = useState<number | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      if (parsedUser.role !== 'guru') {
        setLoading(false);
        return;
      }

      // Get guru_id from user_id
      fetchGuruId(parsedUser.id);
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (guruId) {
      fetchDashboardData(guruId);
      fetchJadwalMendatang(guruId);
      fetchJadwalHariIni(guruId);
    }
  }, [guruId]);

  const fetchGuruId = async (userId: number) => {
    try {
      const response = await fetch('/api/guru');
      const data = await response.json();
      
      if (data.success && data.data) {
        // Find guru by user_id
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
      const response = await fetch(`/api/jadwal?guru_id=${guruId}&status=dijadwalkan`);
      const data = await response.json();
      
      if (data.success && data.data) {
        const upcoming = data.data.filter((jadwal: JadwalKonseling) => {
          const jadwalDate = new Date(`${jadwal.tanggal} ${jadwal.waktu_mulai}`);
          return jadwalDate >= new Date();
        }).slice(0, 5);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'selesai':
        return 'bg-green-900/50 text-green-400';
      case 'berlangsung':
        return 'bg-blue-900/50 text-blue-400';
      case 'dijadwalkan':
        return 'bg-purple-900/50 text-purple-400';
      case 'menunggu':
        return 'bg-yellow-900/50 text-yellow-400';
      case 'dibatalkan':
        return 'bg-red-900/50 text-red-400';
      default:
        return 'bg-gray-900/50 text-gray-400';
    }
  };

  if (!user || user.role !== 'guru') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Akses ditolak. Hanya guru BK yang dapat mengakses halaman ini.</p>
          <Link href="/login/guru" className="text-green-400 hover:underline">
            Login sebagai Guru BK
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-gray-900 shadow-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <Image
                  src="https://smktarunabhakti.sch.id/wp-content/uploads/2020/07/logotbvector-copy.png"
                  alt="Logo SMK Taruna Bhakti"
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Dashboard Guru BK</div>
                <div className="text-xs text-gray-400">SMK Taruna Bhakti</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/guru/jadwal"
                className="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                Jadwal
              </Link>
              <Link
                href="/profile"
                className="px-4 py-2 text-gray-300 hover:text-green-400 transition-colors"
              >
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Dashboard Guru BK
            </h1>
            <p className="text-gray-400">
              Selamat datang, {user.nama_lengkap}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Link
              href="/guru/jadwal"
              className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-green-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Lihat Semua Jadwal</h3>
                  <p className="text-sm text-gray-400">Kelola jadwal konseling Anda</p>
                </div>
              </div>
            </Link>
            <Link
              href="/profile"
              className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700 hover:border-green-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Profile Saya</h3>
                  <p className="text-sm text-gray-400">Lihat dan edit profile</p>
                </div>
              </div>
            </Link>
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Statistik</h3>
                  <p className="text-sm text-gray-400">Lihat statistik konseling</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-400">Memuat data...</p>
            </div>
          ) : dashboardData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-medium opacity-90 mb-1">Total Jadwal</h3>
                  <p className="text-3xl font-bold">{dashboardData.total_jadwal || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-medium opacity-90 mb-1">Hari Ini</h3>
                  <p className="text-3xl font-bold">{dashboardData.jadwal_hari_ini || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-medium opacity-90 mb-1">Mendatang</h3>
                  <p className="text-3xl font-bold">{dashboardData.jadwal_mendatang || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
                  <h3 className="text-sm font-medium opacity-90 mb-1">Selesai</h3>
                  <p className="text-3xl font-bold">{dashboardData.jadwal_selesai || 0}</p>
                </div>
              </div>

              {/* Jadwal Hari Ini */}
              {jadwalHariIni.length > 0 && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-8 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Jadwal Hari Ini</h2>
                  <div className="space-y-4">
                    {jadwalHariIni.map((jadwal) => (
                      <div
                        key={jadwal.id}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-green-500 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{jadwal.nama_siswa}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(jadwal.status)}`}>
                                {jadwal.status.charAt(0).toUpperCase() + jadwal.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">NISN: {jadwal.nisn}</p>
                            <p className="text-gray-400 text-sm mb-1">Layanan: {jadwal.nama_layanan}</p>
                            <p className="text-gray-300">
                              {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })} • {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                            </p>
                            {jadwal.alasan_konseling && (
                              <p className="text-gray-400 text-sm mt-2">Alasan: {jadwal.alasan_konseling}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Jadwal Mendatang */}
              {jadwalMendatang.length > 0 && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-700">
                  <h2 className="text-2xl font-bold text-white mb-4">Jadwal Mendatang</h2>
                  <div className="space-y-4">
                    {jadwalMendatang.map((jadwal) => (
                      <div
                        key={jadwal.id}
                        className="bg-gray-900 rounded-lg p-4 border border-gray-700 hover:border-green-500 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-white">{jadwal.nama_siswa}</h3>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(jadwal.status)}`}>
                                {jadwal.status.charAt(0).toUpperCase() + jadwal.status.slice(1)}
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mb-1">NISN: {jadwal.nisn}</p>
                            <p className="text-gray-400 text-sm mb-1">Layanan: {jadwal.nama_layanan}</p>
                            <p className="text-gray-300">
                              {new Date(jadwal.tanggal).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })} • {jadwal.waktu_mulai} - {jadwal.waktu_selesai}
                            </p>
                            {jadwal.alasan_konseling && (
                              <p className="text-gray-400 text-sm mt-2">Alasan: {jadwal.alasan_konseling}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {jadwalHariIni.length === 0 && jadwalMendatang.length === 0 && (
                <div className="bg-gray-800 rounded-xl shadow-lg p-12 border border-gray-700 text-center">
                  <p className="text-gray-400">Tidak ada jadwal konseling</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400">Tidak ada data dashboard</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

